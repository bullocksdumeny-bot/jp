import { checkHealth } from "@/lib/health";
import Link from "next/link";

export const dynamic = "force-dynamic";

function Dot({ ok, warn = false }: { ok: boolean; warn?: boolean }) {
  const color = ok ? "bg-emerald-500" : warn ? "bg-amber-500" : "bg-red-500";
  return <span className={`inline-block size-2 rounded-full ${color}`} />;
}

export default async function HomePage() {
  const health = await checkHealth();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-10 px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="jp text-2xl font-semibold">動詞活用トレーナー</h1>
          <p className="text-sm text-muted">JLPT N5 动词活用规则训练器</p>
        </div>
      </header>

      <section className="rounded-2xl border border-line bg-card p-6">
        <p className="text-xs font-medium text-accent">现在可以练</p>
        <h2 className="mt-2 text-xl font-semibold">动词分类</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          判断一段、五段和不规则动词，包含常见陷阱词。答完立即看理由。
        </p>
        <Link
          href="/classify"
          className="mt-5 inline-flex rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background"
        >
          开始训练
        </Link>
      </section>

      <section className="rounded-2xl border border-accent/40 bg-card p-6">
        <p className="text-xs font-medium text-accent">推荐入口</p>
        <h2 className="mt-2 text-xl font-semibold">综合训练中心</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          混合全部 N5 题型，自动收集错题，并根据规则掌握度安排薄弱项。
        </p>
        <Link
          href="/training"
          className="mt-5 inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white"
        >
          开始综合训练
        </Link>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6">
        <p className="text-xs font-medium text-accent">N5 活用</p>
        <h2 className="mt-2 text-xl font-semibold">五种常用活用</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          61 个 N5 核心动词，统一练习五种活用；可按题查看规则提示。
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {[
            ["/masu-form", "ます形"],
            ["/nai-form", "ない形"],
            ["/te-form", "て形"],
            ["/ta-form", "た形"],
            ["/tai-form", "たい形"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="jp rounded-xl border border-line px-3 py-3 text-center text-sm font-medium hover:border-accent hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

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
            <Dot ok={health.env.DEEPSEEK_API_KEY} warn />
            <span>
              {health.env.DEEPSEEK_API_KEY
                ? "DeepSeek API Key 已配置"
                : "DeepSeek API Key 未配置（内容生成阶段才需要）"}
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

    </main>
  );
}
