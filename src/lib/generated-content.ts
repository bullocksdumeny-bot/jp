import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { generatedContent } from "@/db/schema";
import { ruleLabel } from "@/lib/training";

export const RULE_LESSON_KIND = "rule_lesson";
export const DEEPSEEK_MODEL = "deepseek-v4-flash";
const PROMPT_VERSION = 1;

export const ruleLessonSchema = z.object({
  title: z.string().min(1).max(40),
  summary: z.string().min(1).max(180),
  memoryTip: z.string().min(1).max(120),
  pitfalls: z.array(z.string().min(1).max(100)).min(1).max(3),
  nextStep: z.string().min(1).max(120),
});

export type RuleLesson = z.infer<typeof ruleLessonSchema>;

const deepSeekResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({ content: z.string().min(1) }),
      }),
    )
    .min(1),
});

async function findCached(ruleId: string): Promise<RuleLesson | null> {
  const db = getDb();
  const [cached] = await db
    .select({ payload: generatedContent.payload })
    .from(generatedContent)
    .where(
      and(
        eq(generatedContent.kind, RULE_LESSON_KIND),
        eq(generatedContent.cacheKey, ruleId),
        eq(generatedContent.promptVersion, PROMPT_VERSION),
        eq(generatedContent.model, DEEPSEEK_MODEL),
      ),
    )
    .limit(1);

  if (!cached) return null;
  const parsed = ruleLessonSchema.safeParse(cached.payload);
  return parsed.success ? parsed.data : null;
}

async function generateRuleLesson(ruleId: string): Promise<RuleLesson> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured");

  const label = ruleLabel(ruleId);
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      thinking: { type: "disabled" },
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是 JLPT N5 日语动词复习文案助手。只写帮助记忆和复习安排的中文文案，不负责计算活用答案，不改写或扩展规则。必须只输出 JSON。",
        },
        {
          role: "user",
          content: `为薄弱规则“${label}”（内部 ID：${ruleId}）写一张简短复习卡。不要给具体动词的活用答案，不要引入 N4/N3 内容。JSON 必须严格符合：{"title":"不超过40字","summary":"不超过180字的重点说明","memoryTip":"不超过120字的记忆提示","pitfalls":["1至3条，每条不超过100字"],"nextStep":"不超过120字的下一步练习建议"}`,
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
  return ruleLessonSchema.parse(raw);
}

export async function getRuleLesson(
  ruleId: string,
): Promise<{ lesson: RuleLesson; cached: boolean }> {
  const cached = await findCached(ruleId);
  if (cached) return { lesson: cached, cached: true };

  const lesson = await generateRuleLesson(ruleId);
  const db = getDb();
  await db
    .insert(generatedContent)
    .values({
      kind: RULE_LESSON_KIND,
      cacheKey: ruleId,
      promptVersion: PROMPT_VERSION,
      model: DEEPSEEK_MODEL,
      payload: lesson,
    })
    .onConflictDoNothing();

  return { lesson, cached: false };
}
