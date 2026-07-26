import { LoginForm } from "./login-form";

export const metadata = { title: "登录 · 動詞活用トレーナー" };

/** 只接受站内相对路径，挡掉 ?next=//evil.com 这类开放重定向。 */
function safeNext(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-8 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="jp text-2xl font-semibold">動詞活用トレーナー</h1>
        <p className="text-sm text-muted">JLPT N5 动词活用规则训练器</p>
      </header>

      <LoginForm nextPath={safeNext(next)} />

      <p className="text-xs text-muted">
        这是个人学习工具，只有站主一个人用。
      </p>
    </main>
  );
}
