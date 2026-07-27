import type { FormType } from "./conjugation";
import { conjugate } from "./conjugation";
import { N5_CORE_VERB_IDS } from "@/data/n5-core";
import { findTeForm } from "@/data/te-forms";
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

export type RuleHintContent = {
  label: string;
  text: string;
};

const GODAN_I_ROW: Record<string, string> = {
  "う": "い",
  "く": "き",
  "ぐ": "ぎ",
  "す": "し",
  "つ": "ち",
  "ぬ": "に",
  "ぶ": "び",
  "む": "み",
  "る": "り",
};

const GODAN_A_ROW: Record<string, string> = {
  "う": "わ",
  "く": "か",
  "ぐ": "が",
  "す": "さ",
  "つ": "た",
  "ぬ": "な",
  "ぶ": "ば",
  "む": "ま",
  "る": "ら",
};

export function ruleHintForQuestion(
  question: TrainingQuestion,
): RuleHintContent | null {
  const ruleId = ruleIdForQuestion(question);
  if (!ruleId || question.kind === "classify") return null;

  const label = ruleLabel(ruleId);
  const suffix = QUESTION_LABELS[question.kind];

  if (ruleId.endsWith("-ichidan")) {
    if (question.kind === "te") {
      return {
        label,
        text: "一段动词：去掉词尾「る」，再接「て」。",
      };
    }
    const ending = {
      masu: "ます",
      nai: "ない",
      ta: "た",
      tai: "たい",
    }[question.kind];
    return {
      label,
      text: `一段动词：去掉词尾「る」，再接「${ending}」。`,
    };
  }

  if (ruleId.endsWith("-suru")) {
    return {
      label,
      text: `「する」是不规则动词，以「し」作为活用连接部分，再组成${suffix}。`,
    };
  }

  if (ruleId.endsWith("-kuru")) {
    return {
      label,
      text: `「来る」是不规则动词，词干读音会发生专用变化，再组成${suffix}。`,
    };
  }

  if (ruleId === "nai-aru") {
    return {
      label,
      text: "「ある」的否定是特例，不套用普通五段动词的あ段变化。",
    };
  }

  if (ruleId.endsWith("-iku")) {
    return {
      label,
      text: `「行く」是特例，不按普通「く」结尾规则；${suffix}使用促音变化。`,
    };
  }

  if (ruleId.includes("u-tsu-ru")) {
    return {
      label,
      text:
        question.kind === "ta"
          ? "五段动词：「う・つ・る」结尾使用促音变化，变为「った」。"
          : "五段动词：「う・つ・る」结尾使用促音变化，变为「って」。",
    };
  }

  if (ruleId.includes("mu-bu-nu")) {
    return {
      label,
      text:
        question.kind === "ta"
          ? "五段动词：「む・ぶ・ぬ」结尾使用拨音变化，变为「んだ」。"
          : "五段动词：「む・ぶ・ぬ」结尾使用拨音变化，变为「んで」。",
    };
  }

  if (ruleId === "te-ku" || ruleId === "ta-ku") {
    return {
      label,
      text:
        question.kind === "ta"
          ? "五段动词：「く」结尾使用イ音便，变为「いた」。"
          : "五段动词：「く」结尾使用イ音便，变为「いて」。",
    };
  }

  if (ruleId === "te-gu" || ruleId === "ta-gu") {
    return {
      label,
      text:
        question.kind === "ta"
          ? "五段动词：「ぐ」结尾使用浊音变化，变为「いだ」。"
          : "五段动词：「ぐ」结尾使用浊音变化，变为「いで」。",
    };
  }

  if (ruleId === "te-su" || ruleId === "ta-su") {
    return {
      label,
      text:
        question.kind === "ta"
          ? "五段动词：「す」结尾把「す」换成「した」。"
          : "五段动词：「す」结尾把「す」换成「して」。",
    };
  }

  const ending = ruleId.at(-1);
  if (!ending) return null;

  if (question.kind === "masu" || question.kind === "tai") {
    const shifted = GODAN_I_ROW[ending];
    const endingSuffix = question.kind === "masu" ? "ます" : "たい";
    return shifted
      ? {
          label,
          text: `五段动词：把词尾「${ending}」换成同行い段「${shifted}」，再接「${endingSuffix}」。`,
        }
      : null;
  }

  if (question.kind === "nai") {
    const shifted = GODAN_A_ROW[ending];
    return shifted
      ? {
          label,
          text: `五段动词：把词尾「${ending}」换成同行あ段「${shifted}」，再接「ない」。`,
        }
      : null;
  }

  return null;
}
