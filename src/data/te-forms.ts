import { findVerb, type VerbType } from "./verbs";

export type TeRule = {
  id: string;
  label: string;
  formula: string;
};

export const TE_RULES: readonly TeRule[] = [
  { id: "te-ichidan", label: "一段", formula: "去る＋て" },
  { id: "te-u-tsu-ru", label: "五段", formula: "う・つ・る → って" },
  { id: "te-mu-bu-nu", label: "五段", formula: "む・ぶ・ぬ → んで" },
  { id: "te-ku", label: "五段", formula: "く → いて" },
  { id: "te-gu", label: "五段", formula: "ぐ → いで" },
  { id: "te-su", label: "五段", formula: "す → して" },
  { id: "te-iku", label: "特例", formula: "行く → 行って" },
  { id: "te-suru", label: "不规则", formula: "する → して" },
  { id: "te-kuru", label: "不规则", formula: "来る → 来て" },
] as const;

type TeFormEntry = {
  verbId: string;
  answer: string;
  ruleId: string;
};

export const TE_FORMS: readonly TeFormEntry[] = [
  { verbId: "taberu", answer: "食べて", ruleId: "te-ichidan" },
  { verbId: "miru", answer: "見て", ruleId: "te-ichidan" },
  { verbId: "okiru", answer: "起きて", ruleId: "te-ichidan" },
  { verbId: "neru", answer: "寝て", ruleId: "te-ichidan" },
  { verbId: "akeru", answer: "開けて", ruleId: "te-ichidan" },
  { verbId: "deru", answer: "出て", ruleId: "te-ichidan" },
  { verbId: "kaku", answer: "書いて", ruleId: "te-ku" },
  { verbId: "yomu", answer: "読んで", ruleId: "te-mu-bu-nu" },
  { verbId: "hanasu", answer: "話して", ruleId: "te-su" },
  { verbId: "matsu", answer: "待って", ruleId: "te-u-tsu-ru" },
  { verbId: "asobu", answer: "遊んで", ruleId: "te-mu-bu-nu" },
  { verbId: "shinu", answer: "死んで", ruleId: "te-mu-bu-nu" },
  { verbId: "kau", answer: "買って", ruleId: "te-u-tsu-ru" },
  { verbId: "oyogu", answer: "泳いで", ruleId: "te-gu" },
  { verbId: "iku", answer: "行って", ruleId: "te-iku" },
  { verbId: "kaeru", answer: "帰って", ruleId: "te-u-tsu-ru" },
  { verbId: "hairu", answer: "入って", ruleId: "te-u-tsu-ru" },
  { verbId: "hashiru", answer: "走って", ruleId: "te-u-tsu-ru" },
  { verbId: "shiru", answer: "知って", ruleId: "te-u-tsu-ru" },
  { verbId: "iru-need", answer: "要って", ruleId: "te-u-tsu-ru" },
  { verbId: "kiru-cut", answer: "切って", ruleId: "te-u-tsu-ru" },
  { verbId: "suberu", answer: "滑って", ruleId: "te-u-tsu-ru" },
  { verbId: "teru", answer: "照って", ruleId: "te-u-tsu-ru" },
  { verbId: "nigiru", answer: "握って", ruleId: "te-u-tsu-ru" },
  { verbId: "suru", answer: "して", ruleId: "te-suru" },
  { verbId: "kuru", answer: "来て", ruleId: "te-kuru" },
] as const;

export function findTeForm(verbId: string): TeFormEntry | undefined {
  return TE_FORMS.find((entry) => entry.verbId === verbId);
}

export function findTeRule(ruleId: string): TeRule | undefined {
  return TE_RULES.find((rule) => rule.id === ruleId);
}

const TYPE_LABELS: Record<VerbType, string> = {
  ichidan: "一段",
  godan: "五段",
  irregular: "不规则",
};

export function explainTeForm(entry: TeFormEntry): string {
  const verb = findVerb(entry.verbId);
  const rule = findTeRule(entry.ruleId);
  if (!verb || !rule) throw new Error(`Invalid te-form entry: ${entry.verbId}`);
  const ending = verb.reading.at(-1);
  return `${verb.dictionary} → ${TYPE_LABELS[verb.type]}动词 → 词尾「${ending}」→ 适用规则「${rule.formula}」→ ${entry.answer}`;
}
