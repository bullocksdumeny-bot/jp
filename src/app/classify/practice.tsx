"use client";

import { useMemo, useState } from "react";

import type { Verb, VerbType } from "@/data/verbs";
import { VERB_TYPE_LABELS } from "@/lib/classification";

type Result = {
  isCorrect: boolean;
  expected: VerbType;
  expectedLabel: string;
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

export function ClassificationPractice({
  verbs,
}: {
  verbs: readonly Verb[];
}) {
  const initialOrder = useMemo(() => shuffledIndices(verbs.length), [verbs.length]);
  const [order, setOrder] = useState(initialOrder);
  const [position, setPosition] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const verb = verbs[order[position]];

  async function answer(type: VerbType) {
    if (pending || result) return;
    setPending(true);
    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          verbId: verb.id,
          answer: type,
        }),
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
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-line bg-card p-6 text-center">
        <p className="mb-2 text-xs text-muted">
          第 {position + 1} / {verbs.length} 题
        </p>
        <h2 className="jp text-5xl font-semibold">{verb.dictionary}</h2>
        <p className="jp mt-2 text-lg text-muted">{verb.reading}</p>
        <p className="mt-1 text-sm text-muted">{verb.meaning}</p>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.entries(VERB_TYPE_LABELS) as [VerbType, string][]).map(
          ([type, label]) => (
            <button
              key={type}
              type="button"
              disabled={pending || result !== null}
              onClick={() => answer(type)}
              className="min-h-14 rounded-xl border border-line bg-card px-4 font-medium transition hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-60"
            >
              {label}
            </button>
          ),
        )}
      </div>

      {result && (
        <section
          className={`rounded-2xl border p-5 ${
            result.isCorrect
              ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50"
              : "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50"
          }`}
        >
          <p className="text-lg font-semibold">
            {result.isCorrect ? "答对了" : `正确答案：${result.expectedLabel}`}
          </p>
          <p className="jp mt-2 text-sm leading-7">{result.explanation}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-current/15 pt-3 text-xs opacity-75">
            <span>累计 {result.stats.attemptCount} 题</span>
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

      <details className="rounded-xl border border-line bg-card p-4 text-sm">
        <summary className="cursor-pointer font-medium">不会判断？先看规则</summary>
        <ol className="mt-3 list-decimal space-y-2 pl-5 leading-6 text-muted">
          <li>「する」「来る」是不规则动词。</li>
          <li>不是「る」结尾，通常是五段动词。</li>
          <li>「い段／え段＋る」通常是一段，但必须检查陷阱词。</li>
          <li>帰る、入る、走る、知る、要る、切る等外形像一段，实际是五段。</li>
        </ol>
      </details>
    </div>
  );
}
