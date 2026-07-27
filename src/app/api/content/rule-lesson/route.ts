import { NextResponse } from "next/server";
import { z } from "zod";

import { N5_CORE_VERB_IDS } from "@/data/n5-core";
import { TE_FORMS } from "@/data/te-forms";
import { findVerb } from "@/data/verbs";
import { conjugate, FORM_TYPES } from "@/lib/conjugation";
import { getRuleLesson } from "@/lib/generated-content";

export const runtime = "nodejs";

const requestSchema = z.object({
  ruleId: z.string().min(1).max(80),
});

const N5_RULE_IDS = new Set<string>([
  "skill-classify",
  ...TE_FORMS.map((entry) => entry.ruleId),
]);

for (const verbId of N5_CORE_VERB_IDS) {
  const verb = findVerb(verbId);
  if (!verb) continue;
  for (const form of FORM_TYPES) {
    N5_RULE_IDS.add(conjugate(verb, form).ruleId);
  }
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid rule" }, { status: 400 });
  }
  if (!N5_RULE_IDS.has(parsed.data.ruleId)) {
    return NextResponse.json({ error: "rule is outside N5" }, { status: 404 });
  }

  try {
    const result = await getRuleLesson(parsed.data.ruleId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to get rule lesson", error);
    return NextResponse.json(
      { error: "暂时无法生成复习提示，请稍后重试" },
      { status: 502 },
    );
  }
}
