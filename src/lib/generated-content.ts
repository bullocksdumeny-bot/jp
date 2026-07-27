import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { generatedContent } from "@/db/schema";
import { N5_CORE_VERB_IDS } from "@/data/n5-core";
import { findTeRule, TE_FORMS } from "@/data/te-forms";
import { findVerb } from "@/data/verbs";
import { conjugate, FORM_TYPES } from "@/lib/conjugation";
import { ruleLabel } from "@/lib/training";

export const RULE_LESSON_KIND = "rule_lesson";
export const DEEPSEEK_MODEL = "deepseek-v4-flash";
const PROMPT_VERSION = 3;

const ruleLessonShape = z.object({
  title: z.string().min(1).max(40),
  summary: z.string().min(1).max(180),
  memoryTip: z.string().min(1).max(120),
  pitfalls: z.array(z.string().min(1).max(100)).min(1).max(3),
  nextStep: z.string().min(1).max(120),
});

export const ruleLessonSchema = ruleLessonShape.superRefine((lesson, context) => {
  const text = [
    lesson.title,
    lesson.summary,
    lesson.memoryTip,
    ...lesson.pitfalls,
    lesson.nextStep,
  ].join("\n");
  if (
    /[\u3040-\u30ffA-Za-z0-9→⇒]|例如|比如|如：|例：/.test(text)
  ) {
    context.addIssue({
      code: "custom",
      message: "模型文案不得包含具体活用答案或示例",
    });
  }
});

export type RuleLesson = z.infer<typeof ruleLessonSchema>;

export const UNSAFE_GENERATED_TEXT =
  /[\u3040-\u30ffA-Za-z0-9→⇒]|例如|比如|如：|例：/;

export function safeGeneratedText(value: string, fallback: string): string {
  return UNSAFE_GENERATED_TEXT.test(value) ? fallback : value;
}

function sanitizeRuleLesson(raw: unknown): RuleLesson {
  const candidate = ruleLessonShape.parse(raw);
  const safePitfalls = candidate.pitfalls.filter(
    (pitfall) => !UNSAFE_GENERATED_TEXT.test(pitfall),
  );
  return ruleLessonSchema.parse({
    title: safeGeneratedText(candidate.title, "把薄弱规则练成条件反射"),
    summary: safeGeneratedText(
      candidate.summary,
      "先准确辨认当前规则的触发条件，再进行短时、重复、交错的提取练习。",
    ),
    memoryTip: safeGeneratedText(
      candidate.memoryTip,
      "把规则压缩成一句口令，作答前默念一次，熟练后再逐步去掉提示。",
    ),
    pitfalls:
      safePitfalls.length > 0
        ? safePitfalls
        : ["只记结果而忽略触发条件，遇到相似规则时容易混淆。"],
    nextStep: safeGeneratedText(
      candidate.nextStep,
      "先回到对应专项复习规则，再连续完成一组练习并及时订正。",
    ),
  });
}

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
  const fact = deterministicRuleFact(ruleId);
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
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
          max_tokens: 500,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "你是日语初级动词复习文案助手。确定性引擎已经提供规则事实。你只写学习策略、记忆方法、易错原因和练习安排；绝对不要生成、复述或举出任何具体动词的活用结果。必须只输出 JSON。JSON 键保持英文，但所有字段值只能使用中文汉字和中文标点，不得出现日文假名、英文字母、数字、箭头或举例措辞。",
            },
            {
              role: "user",
              content: `薄弱规则：“${label}”（内部 ID：${ruleId}）。引擎事实仅供你理解，不得在答案中复述：“${fact}”。不要写任何具体动词或变形后的词，不要引入 N4/N3 内容。JSON 必须严格符合：{"title":"不超过40字","summary":"不超过180字，只谈学习重点","memoryTip":"不超过120字，只谈记忆方法","pitfalls":["1至3条，只谈易错原因，每条不超过100字"],"nextStep":"不超过120字，只给练习安排"}`,
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
      return sanitizeRuleLesson(raw);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function deterministicRuleFact(ruleId: string): string {
  if (ruleId === "skill-classify") {
    return "根据本地词库判断一段、五段或不规则动词，不按是否以る结尾猜测";
  }

  const teEntry = TE_FORMS.find((entry) => entry.ruleId === ruleId);
  if (teEntry) return findTeRule(teEntry.ruleId)?.formula ?? ruleLabel(ruleId);

  for (const verbId of N5_CORE_VERB_IDS) {
    const verb = findVerb(verbId);
    if (!verb) continue;
    for (const form of FORM_TYPES) {
      const result = conjugate(verb, form);
      if (result.ruleId === ruleId) return result.formula;
    }
  }

  return ruleLabel(ruleId);
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
