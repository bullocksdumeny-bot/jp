import { NextResponse } from "next/server";
import { z } from "zod";

import { findTeForm, explainTeForm } from "@/data/te-forms";
import { findVerb } from "@/data/verbs";
import { recordAttempt } from "@/lib/attempts";
import { buildConjugationFeedback } from "@/lib/conjugation-feedback";

export const runtime = "nodejs";

const schema = z.object({
  verbId: z.string().min(1),
  answer: z.string().max(30),
  elapsedMs: z.number().int().min(0).max(600_000).optional(),
});

function normalize(value: string): string {
  return value.trim().replaceAll(/\s/g, "");
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid answer" }, { status: 400 });
  }

  const entry = findTeForm(parsed.data.verbId);
  const verb = findVerb(parsed.data.verbId);
  if (!entry || !verb) {
    return NextResponse.json({ error: "unknown verb" }, { status: 404 });
  }

  const answer = normalize(parsed.data.answer);
  const isCorrect = answer === entry.answer;
  const stats = await recordAttempt({
    ruleId: entry.ruleId,
    verbId: entry.verbId,
    mode: "produce",
    prompt: `${verb.dictionary}的て形是？`,
    expected: entry.answer,
    answer,
    isCorrect,
    elapsedMs: parsed.data.elapsedMs,
  });

  return NextResponse.json({
    isCorrect,
    expected: entry.answer,
    explanation: explainTeForm(entry),
    feedback: isCorrect
      ? null
      : buildConjugationFeedback(verb, "te", answer),
    stats,
  });
}
