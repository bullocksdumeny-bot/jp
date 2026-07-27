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
  { verbId: "oshieru", answer: "教えて", ruleId: "te-ichidan" },
  { verbId: "iru-exist", answer: "いて", ruleId: "te-ichidan" },
  { verbId: "shimeru", answer: "閉めて", ruleId: "te-ichidan" },
  { verbId: "oriru", answer: "降りて", ruleId: "te-ichidan" },
  { verbId: "kiru-wear", answer: "着て", ruleId: "te-ichidan" },
  { verbId: "kariru", answer: "借りて", ruleId: "te-ichidan" },
  { verbId: "kaku", answer: "書いて", ruleId: "te-ku" },
  { verbId: "nomu", answer: "飲んで", ruleId: "te-mu-bu-nu" },
  { verbId: "kiku", answer: "聞いて", ruleId: "te-ku" },
  { verbId: "yomu", answer: "読んで", ruleId: "te-mu-bu-nu" },
  { verbId: "hanasu", answer: "話して", ruleId: "te-su" },
  { verbId: "iu", answer: "言って", ruleId: "te-u-tsu-ru" },
  { verbId: "au", answer: "会って", ruleId: "te-u-tsu-ru" },
  { verbId: "uru", answer: "売って", ruleId: "te-u-tsu-ru" },
  { verbId: "yasumu", answer: "休んで", ruleId: "te-mu-bu-nu" },
  { verbId: "hataraku", answer: "働いて", ruleId: "te-ku" },
  { verbId: "narau", answer: "習って", ruleId: "te-u-tsu-ru" },
  { verbId: "wakaru", answer: "分かって", ruleId: "te-u-tsu-ru" },
  { verbId: "omou", answer: "思って", ruleId: "te-u-tsu-ru" },
  { verbId: "aru", answer: "あって", ruleId: "te-u-tsu-ru" },
  { verbId: "motsu", answer: "持って", ruleId: "te-u-tsu-ru" },
  { verbId: "matsu", answer: "待って", ruleId: "te-u-tsu-ru" },
  { verbId: "tatsu", answer: "立って", ruleId: "te-u-tsu-ru" },
  { verbId: "suwaru", answer: "座って", ruleId: "te-u-tsu-ru" },
  { verbId: "shinu", answer: "死んで", ruleId: "te-mu-bu-nu" },
  { verbId: "asobu", answer: "遊んで", ruleId: "te-mu-bu-nu" },
  { verbId: "kau", answer: "買って", ruleId: "te-u-tsu-ru" },
  { verbId: "aku", answer: "開いて", ruleId: "te-ku" },
  { verbId: "shimaru", answer: "閉まって", ruleId: "te-u-tsu-ru" },
  { verbId: "tsukau", answer: "使って", ruleId: "te-u-tsu-ru" },
  { verbId: "tsukuru", answer: "作って", ruleId: "te-u-tsu-ru" },
  { verbId: "sumu", answer: "住んで", ruleId: "te-mu-bu-nu" },
  { verbId: "aruku", answer: "歩いて", ruleId: "te-ku" },
  { verbId: "oyogu", answer: "泳いで", ruleId: "te-gu" },
  { verbId: "noru", answer: "乗って", ruleId: "te-u-tsu-ru" },
  { verbId: "nugu", answer: "脱いで", ruleId: "te-gu" },
  { verbId: "arau", answer: "洗って", ruleId: "te-u-tsu-ru" },
  { verbId: "toru", answer: "取って", ruleId: "te-u-tsu-ru" },
  { verbId: "oku", answer: "置いて", ruleId: "te-ku" },
  { verbId: "okuru", answer: "送って", ruleId: "te-u-tsu-ru" },
  { verbId: "kasu", answer: "貸して", ruleId: "te-su" },
  { verbId: "kaesu", answer: "返して", ruleId: "te-su" },
  { verbId: "yobu", answer: "呼んで", ruleId: "te-mu-bu-nu" },
  { verbId: "utau", answer: "歌って", ruleId: "te-u-tsu-ru" },
  { verbId: "hajimaru", answer: "始まって", ruleId: "te-u-tsu-ru" },
  { verbId: "owaru", answer: "終わって", ruleId: "te-u-tsu-ru" },
  { verbId: "iku", answer: "行って", ruleId: "te-iku" },
  { verbId: "kaeru", answer: "帰って", ruleId: "te-u-tsu-ru" },
  { verbId: "hairu", answer: "入って", ruleId: "te-u-tsu-ru" },
  { verbId: "hashiru", answer: "走って", ruleId: "te-u-tsu-ru" },
  { verbId: "shiru", answer: "知って", ruleId: "te-u-tsu-ru" },
  { verbId: "kiru-cut", answer: "切って", ruleId: "te-u-tsu-ru" },
  { verbId: "suru", answer: "して", ruleId: "te-suru" },
  { verbId: "benkyou-suru", answer: "勉強して", ruleId: "te-suru" },
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

function display(surface: string, reading: string): string {
  return surface === reading ? surface : `${surface}（${reading}）`;
}

export function teFormReading(entry: TeFormEntry): string {
  const verb = findVerb(entry.verbId);
  if (!verb) throw new Error(`Invalid te-form entry: ${entry.verbId}`);
  const stem = verb.reading.slice(0, -1);
  const endingByRule: Record<string, string> = {
    "te-ichidan": "て",
    "te-u-tsu-ru": "って",
    "te-mu-bu-nu": "んで",
    "te-ku": "いて",
    "te-gu": "いで",
    "te-su": "して",
    "te-iku": "って",
    "te-suru": "して",
    "te-kuru": "きて",
  };
  if (entry.ruleId === "te-suru") {
    return verb.reading.slice(0, -2) + "して";
  }
  if (entry.ruleId === "te-kuru") return "きて";
  const ending = endingByRule[entry.ruleId];
  if (!ending) throw new Error(`Unknown te-form rule: ${entry.ruleId}`);
  return stem + ending;
}

export function hintTeForm(entry: TeFormEntry): string {
  const verb = findVerb(entry.verbId);
  if (!verb) throw new Error(`Invalid te-form entry: ${entry.verbId}`);
  const verbText = display(verb.dictionary, verb.reading);
  const ending = verb.reading.at(-1);

  if (entry.ruleId === "te-ichidan") {
    return `「${verbText}」是一段动词。去掉词尾「る」，再接「て」。`;
  }
  if (entry.ruleId === "te-suru") {
    const surfaceStem = verb.dictionary.slice(0, -2) + "し";
    const readingStem = verb.reading.slice(0, -2) + "し";
    return `「${verbText}」是不规则动词。て形使用活用词干「${display(surfaceStem, readingStem)}」＋「て」。`;
  }
  if (entry.ruleId === "te-kuru") {
    return `「${verbText}」是不规则动词。て形使用「来（き）」＋「て」。`;
  }
  if (entry.ruleId === "te-iku") {
    return `「${verbText}」是五段动词，但て形是词汇级特例：不使用普通的「く→いて」，而使用促音「って」。`;
  }

  const rule = findTeRule(entry.ruleId);
  if (!rule) throw new Error(`Unknown te-form rule: ${entry.ruleId}`);
  return `「${verbText}」是五段动词，词尾是「${ending}」。て形适用「${rule.formula}」。`;
}

export function explainTeForm(entry: TeFormEntry): string {
  const verb = findVerb(entry.verbId);
  const rule = findTeRule(entry.ruleId);
  if (!verb || !rule) throw new Error(`Invalid te-form entry: ${entry.verbId}`);
  const ending = verb.reading.at(-1);
  const verbText = display(verb.dictionary, verb.reading);
  const answerText = display(entry.answer, teFormReading(entry));

  if (entry.ruleId === "te-suru") {
    const surfaceStem = verb.dictionary.slice(0, -2) + "し";
    const readingStem = verb.reading.slice(0, -2) + "し";
    return `${verbText} → 不规则动词 → て形使用「${display(surfaceStem, readingStem)}」＋「て」 → ${answerText}`;
  }
  if (entry.ruleId === "te-kuru") {
    return `${verbText} → 不规则动词 → て形使用「来（き）」＋「て」 → ${answerText}`;
  }
  if (entry.ruleId === "te-iku") {
    return `${verbText} → 五段动词・て形词汇级特例 → 不使用普通的「く→いて」，而使用「って」 → ${answerText}`;
  }
  if (entry.ruleId === "te-ichidan") {
    return `${verbText} → 一段动词 → 去掉词尾「る」＋「て」 → ${answerText}`;
  }
  return `${verbText} → ${TYPE_LABELS[verb.type]}动词・${ending}结尾 → ${rule.formula} → ${answerText}`;
}
