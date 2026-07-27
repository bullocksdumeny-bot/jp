"use client";

import { useEffect, useState, type FormEvent } from "react";

import { VERB_TYPE_LABELS } from "@/lib/classification";
import type { Verb, VerbType } from "@/data/verbs";
import {
  buildTargetedQuestions,
  formFromKind,
  QUESTION_LABELS,
  type TrainingQuestion,
} from "@/lib/training";

type Result = {
  isCorrect: boolean;
  expected: string;
  explanation: string;
  stats: {
    attemptCount: number;
    correctCount: number;
    streak: number;
    accuracy: number;
  };
};

type Mode = "mixed" | "review" | "targeted";

function shuffled<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function TrainingCenter({
  verbs,
  mixedQuestions,
  reviewQuestions,
  targetedQuestions,
}: {
  verbs: readonly Verb[];
  mixedQuestions: readonly TrainingQuestion[];
  reviewQuestions: readonly TrainingQuestion[];
  targetedQuestions: readonly TrainingQuestion[];
}) {
  const [mode, setMode] = useState<Mode>(
    reviewQuestions.length > 0 ? "review" : "mixed",
  );
  const [mixedQueue, setMixedQueue] = useState(() => [...mixedQuestions]);
  const [reviewQueue, setReviewQueue] = useState(() => [...reviewQuestions]);
  const [targetedQueue, setTargetedQueue] = useState(() => [
    ...targetedQuestions,
  ]);
  const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);

  const queue =
    mode === "mixed"
      ? mixedQueue
      : mode === "review"
        ? reviewQueue
        : targetedQueue;
  const question = queue[position];
  const verb = question
    ? verbs.find((item) => item.id === question.verbId)
    : undefined;

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setPosition(0);
    setAnswer("");
    setResult(null);
  }

  useEffect(() => {
    const start = (event: Event) => {
      const ruleIds = (event as CustomEvent<{ ruleIds?: string[] }>).detail
        ?.ruleIds;
      if (ruleIds?.length) {
        setTargetedQueue(buildTargetedQuestions(ruleIds));
      }
      setMode("targeted");
      setPosition(0);
      setAnswer("");
      setResult(null);
    };
    window.addEventListener("start-targeted-training", start);
    return () => window.removeEventListener("start-targeted-training", start);
  }, []);

  async function send(selectedAnswer: string) {
    if (!question || !verb || pending || result) return;
    setPending(true);
    try {
      let url: string;
      let body: object;
      if (question.kind === "classify") {
        url = "/api/classify";
        body = { verbId: verb.id, answer: selectedAnswer };
      } else if (question.kind === "te") {
        url = "/api/te-form";
        body = { verbId: verb.id, answer: selectedAnswer };
      } else {
        url = "/api/conjugate";
        body = {
          verbId: verb.id,
          form: formFromKind(question.kind),
          answer: selectedAnswer,
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("save failed");
      const raw = (await response.json()) as Result & {
        expectedLabel?: string;
      };
      setResult({
        ...raw,
        expected: raw.expectedLabel ?? raw.expected,
      });
    } catch {
      alert("作答保存失败，请检查网络后重试。");
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (answer.trim()) void send(answer);
  }

  function next() {
    if (!question || !result) return;

    if (mode === "review") {
      const remaining = result.isCorrect
        ? reviewQueue.filter((_, index) => index !== position)
        : [
            ...reviewQueue.filter((_, index) => index !== position),
            question,
          ];
      setReviewQueue(remaining);
      setPosition(0);
    } else {
      const nextPosition = position + 1;
      if (nextPosition >= queue.length) {
        if (mode === "mixed") {
          setMixedQueue(shuffled(mixedQueue));
        } else {
          setTargetedQueue(shuffled(targetedQueue));
        }
        setPosition(0);
      } else {
        setPosition(nextPosition);
      }
    }
    setAnswer("");
    setResult(null);
  }

  return (
    <div id="training-center" className="flex scroll-mt-6 flex-col gap-7">
      <div className="grid grid-cols-3 rounded-xl border border-line bg-card p-1">
        <button
          type="button"
          onClick={() => switchMode("targeted")}
          className={`rounded-lg px-2 py-2.5 text-sm font-medium ${
            mode === "targeted"
              ? "bg-foreground text-background"
              : "text-muted"
          }`}
        >
          针对训练（{targetedQueue.length}）
        </button>
        <button
          type="button"
          onClick={() => switchMode("mixed")}
          className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
            mode === "mixed" ? "bg-foreground text-background" : "text-muted"
          }`}
        >
          综合训练
        </button>
        <button
          type="button"
          onClick={() => switchMode("review")}
          className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
            mode === "review" ? "bg-foreground text-background" : "text-muted"
          }`}
        >
          错题强化（{reviewQueue.length}）
        </button>
      </div>

      {!question || !verb ? (
        <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-7 text-center dark:border-emerald-900 dark:bg-emerald-950">
          <p className="text-lg font-semibold">
            {mode === "targeted" ? "暂时没有薄弱规则" : "当前没有待强化错题"}
          </p>
          <p className="mt-2 text-sm text-muted">
            去综合训练做几题，系统会根据记录自动安排。
          </p>
          <button
            type="button"
            onClick={() => switchMode("mixed")}
            className="mt-5 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background"
          >
            开始综合训练
          </button>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-line bg-card p-6 text-center">
            <p className="mb-2 text-xs font-medium text-accent">
              {QUESTION_LABELS[question.kind]}
              {mode === "review" ? " · 错题强化" : ""}
              {mode === "targeted" ? " · 今日针对训练" : ""}
            </p>
            <h2 className="jp text-5xl font-semibold">{verb.dictionary}</h2>
            <p className="jp mt-2 text-lg text-muted">{verb.reading}</p>
            <p className="mt-1 text-sm text-muted">{verb.meaning}</p>
          </section>

          {question.kind === "classify" ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.entries(VERB_TYPE_LABELS) as [VerbType, string][]).map(
                ([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    disabled={pending || result !== null}
                    onClick={() => void send(type)}
                    className="min-h-14 rounded-xl border border-line bg-card px-4 font-medium hover:border-accent hover:text-accent disabled:opacity-50"
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          ) : (
            <form onSubmit={submit} className="flex gap-3">
              <input
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={pending || result !== null}
                placeholder={`输入${QUESTION_LABELS[question.kind]}答案`}
                autoCapitalize="off"
                autoComplete="off"
                className="jp min-w-0 flex-1 rounded-xl border border-line bg-card px-4 py-3 text-lg outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={!answer.trim() || pending || result !== null}
                className="rounded-xl bg-foreground px-5 font-medium text-background disabled:opacity-40"
              >
                判定
              </button>
            </form>
          )}

          {result && (
            <section
              className={`rounded-2xl border p-5 ${
                result.isCorrect
                  ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950"
                  : "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
              }`}
            >
              <p className="text-lg font-semibold">
                {result.isCorrect ? "答对了" : `正确答案：${result.expected}`}
              </p>
              <p className="jp mt-3 text-sm leading-7">{result.explanation}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-current/15 pt-3 text-xs text-muted">
                <span>本规则累计 {result.stats.attemptCount} 题</span>
                <span>正确率 {result.stats.accuracy}%</span>
                <span>连续答对 {result.stats.streak} 题</span>
              </div>
              <button
                type="button"
                onClick={next}
                className="mt-5 w-full rounded-xl bg-foreground px-4 py-3 font-medium text-background"
              >
                {mode === "review" && result.isCorrect ? "移出错题并继续" : "下一题"}
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
