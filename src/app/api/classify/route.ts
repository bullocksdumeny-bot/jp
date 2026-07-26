import { NextResponse } from "next/server";
import { z } from "zod";

import { findVerb, VERB_TYPES } from "@/data/verbs";
import { recordAttempt } from "@/lib/attempts";
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
  const stats = await recordAttempt({
    ruleId: "skill-classify",
    verbId: verb.id,
    mode: "classify",
    prompt: `${verb.dictionary}（${verb.reading}）是什么类型？`,
    expected,
    answer: parsed.data.answer,
    isCorrect,
    elapsedMs: parsed.data.elapsedMs,
  });

  return NextResponse.json({
    isCorrect,
    expected,
    expectedLabel: VERB_TYPE_LABELS[expected],
    explanation: explainClassification(verb),
    stats,
  });
}
