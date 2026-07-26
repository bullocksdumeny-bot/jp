import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { attempts, ruleMastery } from "@/db/schema";

type AttemptInput = {
  ruleId: string;
  verbId: string;
  mode: string;
  prompt: string;
  expected: string;
  answer: string;
  isCorrect: boolean;
  elapsedMs?: number;
};

export async function recordAttempt(input: AttemptInput) {
  const db = getDb();
  await db.insert(attempts).values(input);

  const [current] = await db
    .select()
    .from(ruleMastery)
    .where(eq(ruleMastery.ruleId, input.ruleId))
    .limit(1);

  const attemptCount = (current?.attemptCount ?? 0) + 1;
  const correctCount = (current?.correctCount ?? 0) + (input.isCorrect ? 1 : 0);
  const streak = input.isCorrect ? (current?.streak ?? 0) + 1 : 0;
  const mastery =
    current == null
      ? input.isCorrect ? 1 : 0
      : current.mastery * 0.8 + (input.isCorrect ? 0.2 : 0);
  const lastPracticedAt = new Date();

  await db
    .insert(ruleMastery)
    .values({
      ruleId: input.ruleId,
      attemptCount,
      correctCount,
      streak,
      mastery,
      lastPracticedAt,
    })
    .onConflictDoUpdate({
      target: ruleMastery.ruleId,
      set: { attemptCount, correctCount, streak, mastery, lastPracticedAt },
    });

  return {
    attemptCount,
    correctCount,
    streak,
    accuracy: Math.round((correctCount / attemptCount) * 100),
  };
}
