import { and, eq, gte } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { attempts, generatedContent, ruleMastery } from "@/db/schema";
import {
  DEEPSEEK_MODEL,
  safeGeneratedText,
  UNSAFE_GENERATED_TEXT,
} from "@/lib/generated-content";
import { ruleLabel } from "@/lib/training";

const DAILY_ANALYSIS_KIND = "daily_weakness";
const PROMPT_VERSION = 2;
const SHANGHAI_TIME_ZONE = "Asia/Shanghai";

const insightShape = z.object({
  headline: z.string().min(1).max(40),
  summary: z.string().min(1).max(220),
  commonCauses: z.array(z.string().min(1).max(100)).min(1).max(3),
  plan: z.array(z.string().min(1).max(100)).min(1).max(3),
});

export type DailyInsight = z.infer<typeof insightShape>;

export type WeakRuleMetric = {
  ruleId: string;
  label: string;
  attempts: number;
  wrong: number;
  errorRate: number;
  mastery: number;
};

export type DailyDiagnosis = {
  date: string;
  stats: {
    todayAttempts: number;
    todayCorrect: number;
    recentAttempts: number;
    recentCorrect: number;
  };
  weakRules: WeakRuleMetric[];
  insight: DailyInsight | null;
  cached: boolean;
};

const deepSeekResponseSchema = z.object({
  choices: z
    .array(z.object({ message: z.object({ content: z.string().min(1) }) }))
    .min(1),
});

function shanghaiDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SHANGHAI_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function sanitizeInsight(raw: unknown): DailyInsight {
  const candidate = insightShape.parse(raw);
  const safeCauses = candidate.commonCauses.filter(
    (item) => !UNSAFE_GENERATED_TEXT.test(item),
  );
  const safePlan = candidate.plan.filter(
    (item) => !UNSAFE_GENERATED_TEXT.test(item),
  );
  return insightShape.parse({
    headline: safeGeneratedText(candidate.headline, "今日先突破最薄弱的规则"),
    summary: safeGeneratedText(
      candidate.summary,
      "最近的错误集中在少数规则上。先缩小练习范围，稳定辨认触发条件，再恢复混合训练。",
    ),
    commonCauses:
      safeCauses.length > 0
        ? safeCauses
        : ["相似规则交错出现时，触发条件还没有形成稳定反应。"],
    plan:
      safePlan.length > 0
        ? safePlan
        : ["先完成针对训练，再回到综合训练检查能否稳定迁移。"],
  });
}

async function findCached(date: string): Promise<DailyInsight | null> {
  const db = getDb();
  const [row] = await db
    .select({ payload: generatedContent.payload })
    .from(generatedContent)
    .where(
      and(
        eq(generatedContent.kind, DAILY_ANALYSIS_KIND),
        eq(generatedContent.cacheKey, date),
        eq(generatedContent.promptVersion, PROMPT_VERSION),
        eq(generatedContent.model, DEEPSEEK_MODEL),
      ),
    )
    .limit(1);
  if (!row) return null;
  const parsed = insightShape.safeParse(row.payload);
  return parsed.success ? parsed.data : null;
}

async function generateInsight(
  date: string,
  weakRules: readonly WeakRuleMetric[],
  stats: DailyDiagnosis["stats"],
): Promise<DailyInsight> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured");

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      thinking: { type: "disabled" },
      temperature: 0.2,
      max_tokens: 600,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是个人日语学习教练。统计和薄弱规则已经由程序确定，你只分析学习习惯、共性错因和练习安排。不得生成、复述或举出任何动词活用答案。必须只输出 JSON。JSON 键保持英文，所有字段值只能使用中文汉字和中文标点，不得出现日文假名、英文字母、数字、箭头或举例措辞。",
        },
        {
          role: "user",
          content: `为 ${date} 生成每日诊断。最近学习统计：${JSON.stringify(stats)}。薄弱规则按复习优先级排序：${JSON.stringify(weakRules)}。只讨论共性与训练策略，不复述规则内容。输出：{"headline":"不超过40字","summary":"不超过220字","commonCauses":["一至三条"],"plan":["一至三条"]}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) {
    throw new Error(`DeepSeek request failed: ${response.status}`);
  }
  const envelope = deepSeekResponseSchema.parse(await response.json());
  const raw = JSON.parse(envelope.choices[0].message.content) as unknown;
  return sanitizeInsight(raw);
}

export async function getDailyDiagnosis(): Promise<DailyDiagnosis> {
  const now = new Date();
  const date = shanghaiDateKey(now);
  const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const db = getDb();
  const [recentAttempts, masteryRows] = await Promise.all([
    db.select().from(attempts).where(gte(attempts.createdAt, cutoff)),
    db.select().from(ruleMastery),
  ]);

  const todayRows = recentAttempts.filter(
    (attempt) => shanghaiDateKey(attempt.createdAt) === date,
  );
  const stats = {
    todayAttempts: todayRows.length,
    todayCorrect: todayRows.filter((attempt) => attempt.isCorrect).length,
    recentAttempts: recentAttempts.length,
    recentCorrect: recentAttempts.filter((attempt) => attempt.isCorrect).length,
  };

  const masteryByRule = new Map(
    masteryRows.map((row) => [row.ruleId, row.mastery]),
  );
  const aggregate = new Map<string, { attempts: number; wrong: number }>();
  for (const attempt of recentAttempts) {
    const current = aggregate.get(attempt.ruleId) ?? { attempts: 0, wrong: 0 };
    current.attempts += 1;
    if (!attempt.isCorrect) current.wrong += 1;
    aggregate.set(attempt.ruleId, current);
  }

  const weakRules = [...aggregate]
    .map(([ruleId, counts]) => ({
      ruleId,
      label: ruleLabel(ruleId),
      attempts: counts.attempts,
      wrong: counts.wrong,
      errorRate: Math.round((counts.wrong / counts.attempts) * 100),
      mastery: Math.round((masteryByRule.get(ruleId) ?? 0) * 100),
    }))
    .filter((rule) => rule.wrong > 0)
    .sort(
      (a, b) =>
        b.errorRate - a.errorRate ||
        a.mastery - b.mastery ||
        b.attempts - a.attempts,
    )
    .slice(0, 5);

  if (recentAttempts.length === 0 || weakRules.length === 0) {
    return { date, stats, weakRules, insight: null, cached: false };
  }

  const cachedInsight = await findCached(date);
  if (cachedInsight) {
    return { date, stats, weakRules, insight: cachedInsight, cached: true };
  }

  const insight = await generateInsight(date, weakRules, stats);
  await db
    .insert(generatedContent)
    .values({
      kind: DAILY_ANALYSIS_KIND,
      cacheKey: date,
      promptVersion: PROMPT_VERSION,
      model: DEEPSEEK_MODEL,
      payload: insight,
    })
    .onConflictDoNothing();

  return { date, stats, weakRules, insight, cached: false };
}
