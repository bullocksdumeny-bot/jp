"use client";

import { useState, type FormEvent } from "react";

import type { Verb } from "@/data/verbs";
import type { FormType } from "@/lib/conjugation";

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

function shuffledIndices(length: number): number[] {
  return Array.from({ length }, (_, index) => index).sort(
    () => Math.random() - 0.5,
  );
}

export function FormPractice({
  verbs,
  form,
  example,
}: {
  verbs: readonly Verb[];
  form: FormType;
  example: string;
}) {
  const [order, setOrder] = useState(() =>
    Array.from({ length: verbs.length }, (_, index) => index),
  );
  const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const verb = verbs[order[position]];

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!answer.trim() || pending || result) return;
    setPending(true);
    try {
      const response = await fetch("/api/conjugate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ verbId: verb.id, form, answer }),
      });
      if (!response.ok) throw new Error("save failed");
      setResult((await response.json()) as Result);
    } catch {
      alert("作答保存失败，请检查网络后重试。");
    } finally {
      setPending(false);
    }
  }

  function next() {
    const nextPosition = position + 1;
    if (nextPosition >= order.length) {
      setOrder(shuffledIndices(verbs.length));
      setPosition(0);
    } else {
      setPosition(nextPosition);
    }
    setAnswer("");
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-7">
      <section className="rounded-2xl border border-line bg-card p-6 text-center">
        <p className="mb-2 text-xs text-muted">
          第 {position + 1} / {verbs.length} 题
        </p>
        <h2 className="jp text-5xl font-semibold">{verb.dictionary}</h2>
        <p className="jp mt-2 text-lg text-muted">{verb.reading}</p>
        <p className="mt-1 text-sm text-muted">{verb.meaning}</p>
      </section>

      <form onSubmit={submit} className="flex gap-3">
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={pending || result !== null}
          placeholder={`输入答案，例如：${example}`}
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
            下一题
          </button>
        </section>
      )}
    </div>
  );
}
