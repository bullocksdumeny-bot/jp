import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { attempts, ruleMastery } from "@/db/schema";
import { findVerb, VERB_TYPES } from "@/data/verbs";
import {
  classifyVerb,
  explainClassification,
  VERB_TYPE_LABELS,
} from "@/lib/classification";

export const runtime = "nodejs";

const answerSchema = z.object({
  verbId: z.string().min(1),
  answer: z.enum(VERB_TYPES),
  elapsedMs: z.number().int().min(0).max(600_000).optional(),
});

export async function POST(request: Request) {
  const parsed = answerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid answer" }, { status: 400 });
  }

  const verb = findVerb(parsed.data.verbId);
  if (!verb) {
    return NextResponse.json({ error: "unknown verb" }, { status: 404 });
  }

  const expected = classifyVerb(verb);
  const isCorrect = parsed.data.answer === expected;
  const db = getDb();

  await db.insert(attempts).values({
    ruleId: "skill-classify",
    verbId: verb.id,
    mode: "classify",
    prompt: `${verb.dictionary}（${verb.reading}）是什么类型？`,
    expected,
    answer: parsed.data.answer,
    isCorrect,
    elapsedMs: parsed.data.elapsedMs,
  });

  const [current] = await db
    .select()
    .from(ruleMastery)
    .where(eq(ruleMastery.ruleId, "skill-classify"))
    .limit(1);

  const attemptCount = (current?.attemptCount ?? 0) + 1;
  const correctCount = (current?.correctCount ?? 0) + (isCorrect ? 1 : 0);
  const streak = isCorrect ? (current?.streak ?? 0) + 1 : 0;
  const mastery =
    current == null
      ? isCorrect ? 1 : 0
      : current.mastery * 0.8 + (isCorrect ? 0.2 : 0);

  await db
    .insert(ruleMastery)
    .values({
      ruleId: "skill-classify",
      attemptCount,
      correctCount,
      streak,
      mastery,
      lastPracticedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: ruleMastery.ruleId,
      set: {
        attemptCount,
        correctCount,
        streak,
        mastery,
        lastPracticedAt: new Date(),
      },
    });

  return NextResponse.json({
    isCorrect,
    expected,
    expectedLabel: VERB_TYPE_LABELS[expected],
    explanation: explainClassification(verb),
    stats: {
      attemptCount,
      correctCount,
      streak,
      accuracy: Math.round((correctCount / attemptCount) * 100),
    },
  });
}
