import { findTeForm, findTeRule, teFormReading } from "@/data/te-forms";
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
  answerReading: string;
  ruleId: string;
  formula: string;
  hint: string;
  explanation: string;
};

const I_ROW: Record<string, string> = {
  う: "い", く: "き", ぐ: "ぎ", す: "し", つ: "ち",
  ぬ: "に", ぶ: "び", む: "み", る: "り",
};

const A_ROW: Record<string, string> = {
  う: "わ", く: "か", ぐ: "が", す: "さ", つ: "た",
  ぬ: "な", ぶ: "ば", む: "ま", る: "ら",
};

function display(surface: string, reading: string): string {
  return surface === reading ? surface : `${surface}（${reading}）`;
}

function finish(
  answer: string,
  answerReading: string,
  ruleId: string,
  formula: string,
  hint: string,
  explanation: string,
): Conjugation {
  return {
    answer,
    answerReading,
    ruleId,
    formula,
    hint,
    explanation,
  };
}

function ichidan(verb: Verb, form: FormType): Conjugation {
  const surfaceStem = verb.dictionary.slice(0, -1);
  const readingStem = verb.reading.slice(0, -1);
  const suffix = { masu: "ます", nai: "ない", ta: "た", tai: "たい" }[form];
  const answer = surfaceStem + suffix;
  const answerReading = readingStem + suffix;
  const verbText = display(verb.dictionary, verb.reading);
  return finish(
    answer,
    answerReading,
    `${form}-ichidan`,
    `去る＋${suffix}`,
    `「${verbText}」是一段动词。${FORM_LABELS[form]}去掉词尾「る」，再接「${suffix}」。`,
    `${verbText} → 一段动词 → 去掉词尾「る」＋「${suffix}」 → ${display(answer, answerReading)}`,
  );
}

function irregular(verb: Verb, form: FormType): Conjugation {
  const verbText = display(verb.dictionary, verb.reading);
  const suffix = { masu: "ます", nai: "ない", ta: "た", tai: "たい" }[form];

  if (verb.dictionary.endsWith("する")) {
    const surfaceBase = verb.dictionary.slice(0, -2);
    const readingBase = verb.reading.slice(0, -2);
    const stem = `${surfaceBase}し`;
    const stemReading = `${readingBase}し`;
    const answer = stem + suffix;
    const answerReading = stemReading + suffix;
    const stemText = display(stem, stemReading);
    return finish(
      answer,
      answerReading,
      `${form}-suru`,
      `${stemText}＋${suffix}`,
      `「${verbText}」是不规则动词。${FORM_LABELS[form]}使用活用词干「${stemText}」＋「${suffix}」。`,
      `${verbText} → 不规则动词 → ${FORM_LABELS[form]}使用「${stemText}」＋「${suffix}」 → ${display(answer, answerReading)}`,
    );
  }

  if (verb.id !== "kuru" && verb.dictionary !== "来る") {
    throw new Error(`Unsupported irregular verb: ${verb.dictionary}`);
  }

  const stemReading = form === "nai" ? "こ" : "き";
  const stemText = `来（${stemReading}）`;
  const answer = `来${suffix}`;
  const answerReading = stemReading + suffix;
  return finish(
    answer,
    answerReading,
    `${form}-kuru`,
    `${stemText}＋${suffix}`,
    `「${verbText}」是不规则动词。${FORM_LABELS[form]}使用「${stemText}」＋「${suffix}」。`,
    `${verbText} → 不规则动词 → ${FORM_LABELS[form]}使用「${stemText}」＋「${suffix}」 → ${display(answer, answerReading)}`,
  );
}

function godanIStem(verb: Verb, form: "masu" | "tai"): Conjugation {
  const ending = verb.dictionary.at(-1)!;
  const shifted = I_ROW[ending];
  if (!shifted) throw new Error(`Unsupported godan ending: ${verb.dictionary}`);
  const suffix = form === "masu" ? "ます" : "たい";
  const surfaceStem = verb.dictionary.slice(0, -1) + shifted;
  const readingStem = verb.reading.slice(0, -1) + shifted;
  const answer = surfaceStem + suffix;
  const answerReading = readingStem + suffix;
  const verbText = display(verb.dictionary, verb.reading);
  const formRule =
    form === "tai"
      ? `先取得ます形词干：把「${ending}」移到同行い段「${shifted}」，再接「たい」`
      : `把「${ending}」移到同行い段「${shifted}」，再接「ます」`;
  return finish(
    answer,
    answerReading,
    `${form}-godan-${ending}`,
    `${ending} → ${shifted}＋${suffix}`,
    `「${verbText}」是五段动词，词尾是「${ending}」。${FORM_LABELS[form]}${formRule}。`,
    `${verbText} → 五段动词・${ending}结尾 → ${FORM_LABELS[form]}：${ending}→${shifted}＋${suffix} → ${display(answer, answerReading)}`,
  );
}

function godanNai(verb: Verb): Conjugation {
  if (verb.id === "aru") {
    return finish(
      "ない",
      "ない",
      "nai-aru",
      "ある的ない形（词汇级特例）",
      "「ある」是五段动词，但当前否定活用是词汇级特例：不使用普通的「る→ら＋否定成分」，也不保留「ある」的词干。",
      "ある → 五段动词・ない形词汇级特例 → 不使用「あらない」 → ない",
    );
  }
  const ending = verb.dictionary.at(-1)!;
  const shifted = A_ROW[ending];
  if (!shifted) throw new Error(`Unsupported godan ending: ${verb.dictionary}`);
  const answer = verb.dictionary.slice(0, -1) + shifted + "ない";
  const answerReading = verb.reading.slice(0, -1) + shifted + "ない";
  const verbText = display(verb.dictionary, verb.reading);
  return finish(
    answer,
    answerReading,
    `nai-godan-${ending}`,
    `${ending} → ${shifted}＋ない`,
    `「${verbText}」是五段动词，词尾是「${ending}」。ない形把「${ending}」移到同行あ段「${shifted}」，再接「ない」。`,
    `${verbText} → 五段动词・${ending}结尾 → ない形：${ending}→${shifted}＋ない → ${display(answer, answerReading)}`,
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
  const teReading = teFormReading(te);
  const answerReading = teReading.endsWith("で")
    ? teReading.slice(0, -1) + "だ"
    : teReading.slice(0, -1) + "た";
  const formula = teRule.formula
    .replaceAll("て", "た")
    .replaceAll("で", "だ");
  const verbText = display(verb.dictionary, verb.reading);
  const answerText = display(answer, answerReading);
  const ruleId = te.ruleId.replace("te-", "ta-");
  const ending = verb.reading.at(-1);

  if (te.ruleId === "te-iku") {
    return finish(
      answer,
      answerReading,
      ruleId,
      "行く的た形：促音「った」（词汇级特例）",
      `「${verbText}」是五段动词，但た形是词汇级特例：不使用普通的「く→いた」，而使用促音「った」。`,
      `${verbText} → 五段动词・た形词汇级特例 → 不使用普通的「く→いた」，而使用「った」 → ${answerText}`,
    );
  }

  return finish(
    answer,
    answerReading,
    ruleId,
    formula,
    `「${verbText}」是五段动词，词尾是「${ending}」。た形适用「${formula}」。`,
    `${verbText} → 五段动词・${ending}结尾 → た形适用「${formula}」 → ${answerText}`,
  );
}

export function conjugate(verb: Verb, form: FormType): Conjugation {
  if (verb.type === "irregular") return irregular(verb, form);
  if (verb.type === "ichidan") return ichidan(verb, form);
  if (form === "nai") return godanNai(verb);
  if (form === "ta") return taForm(verb);
  return godanIStem(verb, form);
}
