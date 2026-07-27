import { desc } from "drizzle-orm";
import Link from "next/link";

import { getDb } from "@/db";
import { attempts, ruleMastery } from "@/db/schema";
import { N5_CORE_VERB_IDS } from "@/data/n5-core";
import { VERBS } from "@/data/verbs";
import {
  buildTargetedQuestions,
  kindFromRuleId,
  QUESTION_KINDS,
  routeForKind,
  ruleLabel,
  type TrainingQuestion,
} from "@/lib/training";

import { TrainingCenter } from "./training-center";
import { WeakRuleAdvice } from "./weak-rule-advice";
import { DailyDiagnosis } from "./daily-diagnosis";

export const metadata = { title: "综合训练 · 動詞活用トレーナー" };
export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const db = getDb();
  const [recentAttempts, masteryRows] = await Promise.all([
    db.select().from(attempts).orderBy(desc(attempts.createdAt)).limit(300),
    db
      .select()
      .from(ruleMastery)
      .orderBy(ruleMastery.mastery, desc(ruleMastery.attemptCount))
      .limit(6),
  ]);

  const latest = new Map<string, TrainingQuestion & { isCorrect: boolean }>();
  for (const attempt of recentAttempts) {
    if (!attempt.verbId) continue;
    const kind = kindFromRuleId(attempt.ruleId);
    if (!kind) continue;
    const key = `${attempt.verbId}:${kind}`;
    if (!latest.has(key)) {
      latest.set(key, { verbId: attempt.verbId, kind, isCorrect: attempt.isCorrect });
    }
  }
  const reviewQuestions = [...latest.values()]
    .filter((question) => !question.isCorrect)
    .map(({ verbId, kind }) => ({ verbId, kind }));

  const mixedQuestions: TrainingQuestion[] = N5_CORE_VERB_IDS.map(
    (verbId, index) => ({
      verbId,
      kind: QUESTION_KINDS[index % QUESTION_KINDS.length],
    }),
  );
  const targetedQuestions = buildTargetedQuestions(
    masteryRows.slice(0, 3).map((row) => row.ruleId),
  );
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <header>
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← 返回首页
        </Link>
        <h1 className="mt-5 text-2xl font-semibold">综合训练中心</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          混合分类与五种活用；错题按最新作答状态自动强化。
        </p>
      </header>

      <DailyDiagnosis />

      {masteryRows.length > 0 && (
        <WeakRuleAdvice
          rules={masteryRows.map((row) => {
            const kind = kindFromRuleId(row.ruleId);
            return {
              ruleId: row.ruleId,
              label: ruleLabel(row.ruleId),
              mastery: Math.round(row.mastery * 100),
              href: kind ? routeForKind(kind) : "/training",
            };
          })}
        />
      )}

      <TrainingCenter
        verbs={VERBS}
        mixedQuestions={mixedQuestions}
        reviewQuestions={reviewQuestions}
        targetedQuestions={targetedQuestions}
      />
    </main>
  );
}
