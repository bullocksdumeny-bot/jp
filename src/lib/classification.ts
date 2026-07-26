import type { Verb, VerbType } from "@/data/verbs";

export const VERB_TYPE_LABELS: Record<VerbType, string> = {
  ichidan: "一段动词",
  godan: "五段动词",
  irregular: "不规则动词",
};

export function classifyVerb(verb: Verb): VerbType {
  return verb.type;
}

export function explainClassification(verb: Verb): string {
  return `${verb.dictionary}（${verb.reading}，${verb.meaning}）→ ${VERB_TYPE_LABELS[classifyVerb(verb)]}。${verb.reason}`;
}
