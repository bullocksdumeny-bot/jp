import { findTeForm, findTeRule, teFormReading } from "@/data/te-forms";
import type { Verb } from "@/data/verbs";
import {
  conjugate,
  FORM_LABELS,
  type FormType,
} from "@/lib/conjugation";

export const ERROR_TYPES = [
  "WRONG_CATEGORY",
  "WRONG_ENDING_RULE",
  "USED_MASU_STEM",
  "MISSED_ONBIN",
  "SPECIAL_EXCEPTION",
  "READING_ERROR",
] as const;

export type ErrorType = (typeof ERROR_TYPES)[number];
export type FeedbackForm = FormType | "te";

export type ConjugationFeedback = {
  errorType: ErrorType;
  errorLabel: string;
  userReason: string;
  steps: readonly string[];
  explanation: string;
};

const ERROR_LABELS: Record<ErrorType, string> = {
  WRONG_CATEGORY: "动词类别判断错误",
  WRONG_ENDING_RULE: "词尾规则使用错误",
  USED_MASU_STEM: "误用了ます形词干",
  MISSED_ONBIN: "遗漏了音便",
  SPECIAL_EXCEPTION: "遗漏了词汇级特例",
  READING_ERROR: "书写或读音错误",
};

const SUFFIX: Record<FeedbackForm, string> = {
  masu: "ます",
  nai: "ない",
  te: "て／で",
  ta: "た／だ",
  tai: "たい",
};

function display(surface: string, reading: string): string {
  return surface === reading ? surface : `${surface}（${reading}）`;
}

function normalize(value: string): string {
  return value.trim().replaceAll(/\s/g, "");
}

function answerFor(verb: Verb, form: FeedbackForm) {
  if (form === "te") {
    const entry = findTeForm(verb.id);
    if (!entry) throw new Error(`Missing te form: ${verb.id}`);
    return {
      answer: entry.answer,
      answerReading: teFormReading(entry),
      ruleId: entry.ruleId,
      formula: findTeRule(entry.ruleId)?.formula ?? entry.ruleId,
    };
  }
  return conjugate(verb, form);
}

function masuStem(verb: Verb): string {
  return conjugate(verb, "masu").answer.slice(0, -"ます".length);
}

function looksLikeIchidanRule(verb: Verb, form: FeedbackForm, answer: string) {
  if (verb.type !== "godan" || !verb.dictionary.endsWith("る")) return false;
  return answer === verb.dictionary.slice(0, -1) + SUFFIX[form].split("／")[0];
}

function diagnoseType(
  verb: Verb,
  form: FeedbackForm,
  userAnswer: string,
  expected: ReturnType<typeof answerFor>,
): ErrorType {
  if (
    (verb.id === "iku" && (form === "te" || form === "ta")) ||
    (verb.id === "aru" && form === "nai")
  ) {
    return "SPECIAL_EXCEPTION";
  }
  if (looksLikeIchidanRule(verb, form, userAnswer)) return "WRONG_CATEGORY";
  if (
    (form === "te" || form === "ta") &&
    userAnswer.startsWith(masuStem(verb)) &&
    userAnswer !== expected.answer
  ) {
    return "USED_MASU_STEM";
  }
  if (
    (form === "te" || form === "ta") &&
    verb.type === "godan" &&
    userAnswer.startsWith(verb.dictionary.slice(0, -1))
  ) {
    return "MISSED_ONBIN";
  }
  if (
    normalize(userAnswer) === expected.answerReading ||
    /[ぁ-ん]/.test(userAnswer)
  ) {
    return "READING_ERROR";
  }
  return "WRONG_ENDING_RULE";
}

function userReason(
  type: ErrorType,
  verb: Verb,
  form: FeedbackForm,
  expected: ReturnType<typeof answerFor>,
): string {
  if (type === "WRONG_CATEGORY") {
    return `你把「${verb.dictionary}」按一段动词处理了；它实际上是五段「る」结尾动词。`;
  }
  if (type === "USED_MASU_STEM") {
    return `你使用了ます形词干「${masuStem(verb)}」，但${form === "te" ? "て形" : "た形"}要按词尾音便规则变化。`;
  }
  if (type === "MISSED_ONBIN") {
    return `你保留了原词干附近的写法，没有完成${form === "te" ? "て形" : "た形"}所需的音便。`;
  }
  if (type === "SPECIAL_EXCEPTION") {
    if (verb.id === "iku") {
      return `「行く」在${form === "te" ? "て形" : "た形"}中不使用普通的「く→${form === "te" ? "いて" : "いた"}」，要使用促音。`;
    }
    return "「ある」的ない形是词汇级特例，不能按普通五段规则写成「あらない」。";
  }
  if (type === "READING_ERROR") {
    return `你的写法与标准答案不一致；请同时核对汉字形式和读音「${expected.answerReading}」。`;
  }
  return `你选择的词尾变化与本题规则不一致；当前应使用「${expected.formula}」。`;
}

function categoryStep(verb: Verb): string {
  if (verb.type === "ichidan") return "一段动词";
  if (verb.type === "irregular") return "不规则动词";
  return "五段动词";
}

export function buildConjugationFeedback(
  verb: Verb,
  form: FeedbackForm,
  rawUserAnswer: string,
): ConjugationFeedback {
  const userAnswer = normalize(rawUserAnswer);
  const expected = answerFor(verb, form);
  const errorType = diagnoseType(verb, form, userAnswer, expected);
  const formLabel = form === "te" ? "て形" : FORM_LABELS[form];
  const ending = verb.reading.at(-1);
  const category =
    verb.type === "godan"
      ? `${categoryStep(verb)}・${ending}结尾`
      : categoryStep(verb);
  const steps = [
    display(verb.dictionary, verb.reading),
    category,
    `${formLabel}：${expected.formula}`,
    `接续：${SUFFIX[form]}`,
    `正确答案：${display(expected.answer, expected.answerReading)}`,
  ];
  const reason = userReason(errorType, verb, form, expected);
  return {
    errorType,
    errorLabel: ERROR_LABELS[errorType],
    userReason: reason,
    steps,
    explanation: `${reason}\n${steps.join("\n↓ ")}`,
  };
}
