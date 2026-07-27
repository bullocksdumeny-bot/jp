import type { FormType } from "./conjugation";
import { conjugate } from "./conjugation";
import { N5_CORE_VERB_IDS } from "@/data/n5-core";
import { findTeForm, hintTeForm } from "@/data/te-forms";
import { findVerb } from "@/data/verbs";

export const QUESTION_KINDS = [
  "classify",
  "te",
  "masu",
  "nai",
  "ta",
  "tai",
] as const;

export type QuestionKind = (typeof QUESTION_KINDS)[number];

export type TrainingQuestion = {
  verbId: string;
  kind: QuestionKind;
};

export const QUESTION_LABELS: Record<QuestionKind, string> = {
  classify: "动词分类",
  te: "て形",
  masu: "ます形",
  nai: "ない形",
  ta: "た形",
  tai: "たい形",
};

export function kindFromRuleId(ruleId: string): QuestionKind | null {
  if (ruleId === "skill-classify") return "classify";
  for (const kind of QUESTION_KINDS) {
    if (kind !== "classify" && ruleId.startsWith(`${kind}-`)) return kind;
  }
  return null;
}

export function formFromKind(kind: QuestionKind): FormType | null {
  if (kind === "masu" || kind === "nai" || kind === "ta" || kind === "tai") {
    return kind;
  }
  return null;
}

export function routeForKind(kind: QuestionKind): string {
  if (kind === "classify") return "/classify";
  if (kind === "te") return "/te-form";
  return `/${kind}-form`;
}

const ENDING_LABELS: Record<string, string> = {
  "う": "う结尾",
  "く": "く结尾",
  "ぐ": "ぐ结尾",
  "す": "す结尾",
  "つ": "つ结尾",
  "ぬ": "ぬ结尾",
  "ぶ": "ぶ结尾",
  "む": "む结尾",
  "る": "る结尾",
};

export function ruleLabel(ruleId: string): string {
  if (ruleId === "skill-classify") return "动词类型判断";
  const kind = kindFromRuleId(ruleId);
  if (!kind) return ruleId;
  const formLabel = QUESTION_LABELS[kind];
  if (ruleId.endsWith("-ichidan")) return `${formLabel} · 一段`;
  if (ruleId.endsWith("-suru")) return `${formLabel} · する`;
  if (ruleId.endsWith("-kuru")) return `${formLabel} · 来る`;
  if (ruleId === "nai-aru") return "ない形 · ある特例";
  if (ruleId.endsWith("-iku")) return `${formLabel} · 行く特例`;
  for (const [ending, label] of Object.entries(ENDING_LABELS)) {
    if (ruleId.endsWith(`-${ending}`)) return `${formLabel} · ${label}`;
  }
  if (ruleId.includes("u-tsu-ru")) return `${formLabel} · う・つ・る`;
  if (ruleId.includes("mu-bu-nu")) return `${formLabel} · む・ぶ・ぬ`;
  return formLabel;
}

export function ruleIdForQuestion(
  question: TrainingQuestion,
): string | null {
  if (question.kind === "classify") return "skill-classify";
  if (question.kind === "te") {
    return findTeForm(question.verbId)?.ruleId ?? null;
  }
  const verb = findVerb(question.verbId);
  const form = formFromKind(question.kind);
  if (!verb || !form) return null;
  return conjugate(verb, form).ruleId;
}

export function buildTargetedQuestions(
  ruleIds: readonly string[],
  perRule = 5,
): TrainingQuestion[] {
  const questions: TrainingQuestion[] = [];
  for (const ruleId of ruleIds) {
    let added = 0;
    for (const verbId of N5_CORE_VERB_IDS) {
      for (const kind of QUESTION_KINDS) {
        const question = { verbId, kind };
        if (ruleIdForQuestion(question) !== ruleId) continue;
        questions.push(question);
        added += 1;
        if (added >= perRule) break;
      }
      if (added >= perRule) break;
    }
  }
  return questions;
}

export type RuleTrainingOption = {
  ruleId: string;
  label: string;
  questionCount: number;
};

export function listRuleTrainingOptions(): RuleTrainingOption[] {
  const counts = new Map<string, number>();
  for (const verbId of N5_CORE_VERB_IDS) {
    for (const kind of QUESTION_KINDS) {
      if (kind === "classify") continue;
      const ruleId = ruleIdForQuestion({ verbId, kind });
      if (ruleId) counts.set(ruleId, (counts.get(ruleId) ?? 0) + 1);
    }
  }
  return [...counts].map(([ruleId, questionCount]) => ({
    ruleId,
    label: ruleLabel(ruleId),
    questionCount,
  }));
}

export type RuleHintContent = {
  label: string;
  text: string;
};

export function ruleHintForQuestion(
  question: TrainingQuestion,
): RuleHintContent | null {
  const ruleId = ruleIdForQuestion(question);
  if (!ruleId || question.kind === "classify") return null;

  const label = ruleLabel(ruleId);
  if (question.kind === "te") {
    const entry = findTeForm(question.verbId);
    return entry ? { label, text: hintTeForm(entry) } : null;
  }

  const verb = findVerb(question.verbId);
  const form = formFromKind(question.kind);
  return verb && form ? { label, text: conjugate(verb, form).hint } : null;
}
