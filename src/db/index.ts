import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "缺少环境变量 DATABASE_URL。本地请填 .env.local，线上请在 Vercel 项目设置里配置。",
    );
  }
  return url;
}

// 延迟初始化：next build 期间会 import 这个模块做静态分析，此时未必有
// DATABASE_URL。若在模块顶层就连库，缺变量会直接把构建炸掉。
let sqlClient: NeonQueryFunction<false, false> | null = null;
let dbClient: NeonHttpDatabase<typeof schema> | null = null;

/** 原始 neon 客户端，用于健康检查这类不走 ORM 的裸 SQL。 */
export function getSql(): NeonQueryFunction<false, false> {
  sqlClient ??= neon(connectionString());
  return sqlClient;
}

export function getDb(): NeonHttpDatabase<typeof schema> {
  dbClient ??= drizzle(getSql(), { schema });
  return dbClient;
}

export { schema };
