import { count } from "drizzle-orm";

import { getDb, getSql } from "@/db";
import { attempts, generatedContent, ruleMastery } from "@/db/schema";

export type Health = {
  ok: boolean;
  env: Record<string, boolean>;
  db:
    | { connected: false; error: string }
    | {
        connected: true;
        serverTime: string;
        latencyMs: number;
        migrations: "applied" | "pending";
        rows?: {
          attempts: number;
          ruleMastery: number;
          generatedContent: number;
        };
        error?: string;
      };
};

const message = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/** 验证「浏览器 → Vercel → Neon」整条链路，部署后第一件要看的东西。 */
export async function checkHealth(): Promise<Health> {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    // 内容生成模块使用，缺了不算不健康。
    DEEPSEEK_API_KEY: Boolean(process.env.DEEPSEEK_API_KEY),
  };

  const startedAt = Date.now();
  let db: Health["db"];

  try {
    const rows = (await getSql()`select now() as now`) as { now: string }[];
    const latencyMs = Date.now() - startedAt;
    const serverTime = String(rows[0]?.now ?? "");

    try {
      const drizzleDb = getDb();
      const [a, m, g] = await Promise.all([
        drizzleDb.select({ n: count() }).from(attempts),
        drizzleDb.select({ n: count() }).from(ruleMastery),
        drizzleDb.select({ n: count() }).from(generatedContent),
      ]);
      db = {
        connected: true,
        serverTime,
        latencyMs,
        migrations: "applied",
        rows: {
          attempts: a[0].n,
          ruleMastery: m[0].n,
          generatedContent: g[0].n,
        },
      };
    } catch (tableError) {
      // 连得上库但读不到表 —— 迁移还没跑。
      db = {
        connected: true,
        serverTime,
        latencyMs,
        migrations: "pending",
        error: message(tableError),
      };
    }
  } catch (error) {
    db = { connected: false, error: message(error) };
  }

  const ok =
    env.DATABASE_URL &&
    db.connected &&
    db.migrations === "applied";

  return { ok, env, db };
}
