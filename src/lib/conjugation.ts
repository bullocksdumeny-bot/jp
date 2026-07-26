import { findTeForm, findTeRule } from "@/data/te-forms";
import type { Verb } from "@/data/verbs";

export const FORM_TYPES = ["masu", "nai", "ta", "tai"] as const;
export type FormType = (typeof FORM_TYPES)[number];

export const FORM_LABELS: Record<FormType, string> = {
  masu: "ます形",
  nai: "ない形",
  ta: "た形",
  tai: "たい形",
};

export type Conjugation = {
  answer: string;
  ruleId: string;
  formula: string;
  explanation: string;
};

const TYPE_LABELS = {
  ichidan: "一段",
  godan: "五段",
  irregular: "不规则",
} as const;

const I_ROW: Record<string, string> = {
  う: "い", く: "き", ぐ: "ぎ", す: "し", つ: "ち",
  ぬ: "に", ぶ: "び", む: "み", る: "り",
};

const A_ROW: Record<string, string> = {
  う: "わ", く: "か", ぐ: "が", す: "さ", つ: "た",
  ぬ: "な", ぶ: "ば", む: "ま", る: "ら",
};

function finish(
  verb: Verb,
  form: FormType,
  answer: string,
  ruleId: string,
  formula: string,
): Conjugation {
  const ending = verb.reading.at(-1);
  return {
    answer,
    ruleId,
    formula,
    explanation: `${verb.dictionary} → ${TYPE_LABELS[verb.type]}动词 → 词尾「${ending}」→ 适用规则「${formula}」→ ${answer}`,
  };
}

function ichidan(verb: Verb, form: FormType): Conjugation {
  const stem = verb.dictionary.slice(0, -1);
  const suffix = { masu: "ます", nai: "ない", ta: "た", tai: "たい" }[form];
  return finish(
    verb,
    form,
    stem + suffix,
    `${form}-ichidan`,
    `去る＋${suffix}`,
  );
}

function irregular(verb: Verb, form: FormType): Conjugation {
  const isSuru = verb.id === "suru";
  const answers = isSuru
    ? { masu: "します", nai: "しない", ta: "した", tai: "したい" }
    : { masu: "来ます", nai: "来ない", ta: "来た", tai: "来たい" };
  const answer = answers[form];
  return finish(
    verb,
    form,
    answer,
    `${form}-${isSuru ? "suru" : "kuru"}`,
    `${verb.dictionary} → ${answer}`,
  );
}

function godanIStem(verb: Verb, form: "masu" | "tai"): Conjugation {
  const ending = verb.dictionary.at(-1)!;
  const shifted = I_ROW[ending];
  if (!shifted) throw new Error(`Unsupported godan ending: ${verb.dictionary}`);
  const suffix = form === "masu" ? "ます" : "たい";
  return finish(
    verb,
    form,
    verb.dictionary.slice(0, -1) + shifted + suffix,
    `${form}-godan-${ending}`,
    `${ending} → ${shifted}＋${suffix}`,
  );
}

function godanNai(verb: Verb): Conjugation {
  if (verb.id === "aru") {
    return finish(verb, "nai", "ない", "nai-aru", "ある → ない（特例）");
  }
  const ending = verb.dictionary.at(-1)!;
  const shifted = A_ROW[ending];
  if (!shifted) throw new Error(`Unsupported godan ending: ${verb.dictionary}`);
  return finish(
    verb,
    "nai",
    verb.dictionary.slice(0, -1) + shifted + "ない",
    `nai-godan-${ending}`,
    `${ending} → ${shifted}＋ない`,
  );
}

function taForm(verb: Verb): Conjugation {
  const te = findTeForm(verb.id);
  if (!te) throw new Error(`Missing te-form source: ${verb.id}`);
  const teRule = findTeRule(te.ruleId);
  if (!teRule) throw new Error(`Missing te-form rule: ${te.ruleId}`);
  const answer = te.answer.endsWith("で")
    ? te.answer.slice(0, -1) + "だ"
    : te.answer.slice(0, -1) + "た";
  const formula = teRule.formula
    .replaceAll("て", "た")
    .replaceAll("で", "だ");
  return finish(verb, "ta", answer, te.ruleId.replace("te-", "ta-"), formula);
}

export function conjugate(verb: Verb, form: FormType): Conjugation {
  if (verb.type === "irregular") return irregular(verb, form);
  if (verb.type === "ichidan") return ichidan(verb, form);
  if (form === "nai") return godanNai(verb);
  if (form === "ta") return taForm(verb);
  return godanIStem(verb, form);
}
