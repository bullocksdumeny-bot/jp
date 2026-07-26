import { checkHealth } from "@/lib/health";
import { requireSession } from "@/lib/session";

import { LogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";

const ROADMAP = [
  { phase: "1", name: "脚手架 + 部署链路 + 访问保护", done: true },
  { phase: "2", name: "第一章 动词分类（含陷阱动词判定模式）", done: false },
  { phase: "3", name: "第四章 て形全链路（学习 → 规则应用 → 输出 → 掌握度）", done: false },
  { phase: "4", name: "ます形 / ない形 / た形 / たい形", done: false },
  { phase: "5", name: "综合训练 + 错题强化 + 薄弱规则推荐", done: false },
  { phase: "6", name: "内容生成模块接入 Anthropic API", done: false },
];

function Dot({ ok, warn = false }: { ok: boolean; warn?: boolean }) {
  const color = ok ? "bg-emerald-500" : warn ? "bg-amber-500" : "bg-red-500";
  return <span className={`inline-block size-2 rounded-full ${color}`} />;
}

export default async function HomePage() {
  await requireSession();
  const health = await checkHealth();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-10 px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="jp text-2xl font-semibold">動詞活用トレーナー</h1>
          <p className="text-sm text-muted">JLPT N5 动词活用规则训练器</p>
        </div>
        <LogoutButton />
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">链路自检</h2>
        <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-card p-4 text-sm">
          <div className="flex items-center gap-2.5">
            <Dot ok={health.db.connected} />
            <span>
              {health.db.connected
                ? `数据库已连通（${health.db.latencyMs}ms）`
                : "数据库连不上"}
            </span>
          </div>

          {health.db.connected && (
            <div className="flex items-center gap-2.5">
              <Dot ok={health.db.migrations === "applied"} warn />
              <span>
                {health.db.migrations === "applied"
                  ? `数据表就绪（作答 ${health.db.rows?.attempts ?? 0} 条 / 掌握度 ${health.db.rows?.ruleMastery ?? 0} 条 / 内容缓存 ${health.db.rows?.generatedContent ?? 0} 条）`
                  : "数据表还没建，需要跑一次迁移"}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <Dot ok={health.env.ANTHROPIC_API_KEY} warn />
            <span>
              {health.env.ANTHROPIC_API_KEY
                ? "内容生成 API Key 已配置"
                : "内容生成 API Key 未配置（Phase 6 才需要）"}
            </span>
          </div>

          {!health.db.connected && (
            <pre className="overflow-x-auto rounded-lg bg-background p-3 text-xs text-muted">
              {health.db.error}
            </pre>
          )}
        </div>
        <p className="text-xs text-muted">
          机器可读版本在{" "}
          <a href="/api/health" className="underline underline-offset-4">
            /api/health
          </a>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">开发进度</h2>
        <ol className="flex flex-col gap-px overflow-hidden rounded-xl border border-line bg-line">
          {ROADMAP.map((item) => (
            <li
              key={item.phase}
              className="flex items-center gap-3 bg-card px-4 py-3 text-sm"
            >
              <span className="w-5 shrink-0 font-mono text-xs text-muted">
                {item.phase}
              </span>
              <span className={item.done ? "" : "text-muted"}>{item.name}</span>
              {item.done && (
                <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400">
                  已完成
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
