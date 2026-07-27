"use client";

import Link from "next/link";
import { useState } from "react";

import type { RuleLesson } from "@/lib/generated-content";

type WeakRule = {
  ruleId: string;
  label: string;
  mastery: number;
  href: string;
};

export function WeakRuleAdvice({ rules }: { rules: readonly WeakRule[] }) {
  const [lessons, setLessons] = useState<Record<string, RuleLesson>>({});
  const [pendingRule, setPendingRule] = useState<string | null>(null);
  const [errorRule, setErrorRule] = useState<string | null>(null);

  async function loadLesson(ruleId: string) {
    if (pendingRule || lessons[ruleId]) return;
    setPendingRule(ruleId);
    setErrorRule(null);
    try {
      const response = await fetch("/api/content/rule-lesson", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ruleId }),
      });
      if (!response.ok) throw new Error("generation failed");
      const data = (await response.json()) as { lesson: RuleLesson };
      setLessons((current) => ({ ...current, [ruleId]: data.lesson }));
    } catch {
      setErrorRule(ruleId);
    } finally {
      setPendingRule(null);
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <h2 className="font-semibold">优先复习这些薄弱规则</h2>
      <p className="mt-1 text-xs leading-5 text-muted">
        DeepSeek 只补充记忆提示；规则和判题仍由本地引擎负责。
      </p>
      <div className="mt-4 grid gap-3">
        {rules.map((rule) => {
          const lesson = lessons[rule.ruleId];
          return (
            <article
              key={rule.ruleId}
              className="rounded-xl bg-background px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Link
                  href={rule.href}
                  className="min-w-0 flex-1 hover:text-accent"
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{rule.label}</span>
                    <span className="text-muted">{rule.mastery}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${rule.mastery}%` }}
                    />
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => void loadLesson(rule.ruleId)}
                  disabled={pendingRule !== null || Boolean(lesson)}
                  className="shrink-0 rounded-lg border border-line px-3 py-2 text-xs font-medium hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  {lesson
                    ? "已生成"
                    : pendingRule === rule.ruleId
                      ? "生成中…"
                      : "复习提示"}
                </button>
              </div>

              {errorRule === rule.ruleId && (
                <p className="mt-3 text-xs text-accent">
                  暂时无法生成，请稍后再试。
                </p>
              )}

              {lesson && (
                <div className="mt-4 border-t border-line pt-4 text-sm leading-6">
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="mt-2">{lesson.summary}</p>
                  <p className="mt-2">
                    <span className="font-medium">记忆提示：</span>
                    {lesson.memoryTip}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                    {lesson.pitfalls.map((pitfall) => (
                      <li key={pitfall}>{pitfall}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-accent">{lesson.nextStep}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
