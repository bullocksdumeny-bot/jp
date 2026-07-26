import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local", quiet: true });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("缺少 DATABASE_URL。先把 .env.example 复制成 .env.local 并填好。");
  process.exit(1);
}

const db = drizzle(neon(url));

console.log("正在应用迁移…");
migrate(db, { migrationsFolder: "./drizzle" })
  .then(() => console.log("迁移完成。"))
  .catch((error) => {
    console.error("迁移失败：", error);
    process.exit(1);
  });
