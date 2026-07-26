import { NextResponse } from "next/server";
import { z } from "zod";

import { N5_CORE_VERB_IDS } from "@/data/n5-core";
import { findVerb } from "@/data/verbs";
import { recordAttempt } from "@/lib/attempts";
import {
  conjugate,
  FORM_LABELS,
  FORM_TYPES,
} from "@/lib/conjugation";

export const runtime = "nodejs";

const schema = z.object({
  verbId: z.string().min(1),
  form: z.enum(FORM_TYPES),
  answer: z.string().max(30),
});

function normalize(value: string): string {
  return value.trim().replaceAll(/\s/g, "");
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid answer" }, { status: 400 });
  }

  if (!(N5_CORE_VERB_IDS as readonly string[]).includes(parsed.data.verbId)) {
    return NextResponse.json({ error: "verb is outside N5 core" }, { status: 404 });
  }

  const verb = findVerb(parsed.data.verbId);
  if (!verb) {
    return NextResponse.json({ error: "unknown verb" }, { status: 404 });
  }

  const result = conjugate(verb, parsed.data.form);
  const answer = normalize(parsed.data.answer);
  const isCorrect = answer === result.answer;
  const stats = await recordAttempt({
    ruleId: result.ruleId,
    verbId: verb.id,
    mode: "produce",
    prompt: `${verb.dictionary}的${FORM_LABELS[parsed.data.form]}是？`,
    expected: result.answer,
    answer,
    isCorrect,
  });

  return NextResponse.json({
    isCorrect,
    expected: result.answer,
    explanation: result.explanation,
    stats,
  });
}
