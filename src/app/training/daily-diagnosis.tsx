"use client";

import { useEffect, useState } from "react";

import type { DailyDiagnosis as Diagnosis } from "@/lib/daily-analysis";

export function DailyDiagnosis() {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch("/api/daily-diagnosis")
      .then((response) => {
        if (!response.ok) throw new Error("diagnosis failed");
        return response.json() as Promise<Diagnosis>;
      })
      .then((data) => {
        if (active) setDiagnosis(data);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  function startTargetedTraining() {
    window.dispatchEvent(
      new CustomEvent("start-targeted-training", {
        detail: {
          ruleIds: diagnosis?.weakRules
            .slice(0, 3)
            .map((rule) => rule.ruleId),
        },
      }),
    );
    document
      .getElementById("training-center")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (failed) {
    return (
      <section className="rounded-2xl border border-line bg-card p-5 text-sm text-muted">
        今日诊断暂时不可用，不影响正常训练和记录保存。
      </section>
    );
  }

  if (!diagnosis) {
    return (
      <section className="rounded-2xl border border-line bg-card p-5">
        <p className="text-sm text-muted">正在整理最近七天的练习记录…</p>
      </section>
    );
  }

  const todayAccuracy =
    diagnosis.stats.todayAttempts > 0
      ? Math.round(
          (diagnosis.stats.todayCorrect / diagnosis.stats.todayAttempts) * 100,
        )
      : 0;
  const recentAccuracy =
    diagnosis.stats.recentAttempts > 0
      ? Math.round(
          (diagnosis.stats.recentCorrect / diagnosis.stats.recentAttempts) *
            100,
        )
      : 0;

  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-accent">每日学习诊断</p>
          <h2 className="mt-1 text-lg font-semibold">
            {diagnosis.insight?.headline ?? "先积累一些错题再分析"}
          </h2>
        </div>
        <span className="text-xs text-muted">{diagnosis.date}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
        <div className="rounded-xl bg-background p-3">
          <strong className="block text-lg">{diagnosis.stats.todayAttempts}</strong>
          今日题数 · {todayAccuracy}%
        </div>
        <div className="rounded-xl bg-background p-3">
          <strong className="block text-lg">
            {diagnosis.stats.recentAttempts}
          </strong>
          近七天 · {recentAccuracy}%
        </div>
      </div>

      {diagnosis.insight ? (
        <>
          <p className="mt-4 text-sm leading-6">{diagnosis.insight.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {diagnosis.weakRules.slice(0, 3).map((rule) => (
              <span
                key={rule.ruleId}
                className="rounded-full border border-line px-3 py-1.5 text-xs"
              >
                {rule.label} · 错误率 {rule.errorRate}%
              </span>
            ))}
          </div>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <h3 className="font-medium">共性错因</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                {diagnosis.insight.commonCauses.map((cause) => (
                  <li key={cause}>{cause}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">今日突破计划</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted">
                {diagnosis.insight.plan.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          <button
            type="button"
            onClick={startTargetedTraining}
            className="mt-5 w-full rounded-xl bg-accent px-4 py-3 font-medium text-white"
          >
            开始今日针对训练
          </button>
        </>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted">
          最近七天没有可分析的错题。继续做综合训练，新的错误会自动进入明日诊断。
        </p>
      )}
    </section>
  );
}
