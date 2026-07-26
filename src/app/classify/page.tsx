import Link from "next/link";

import { VERBS } from "@/data/verbs";

import { ClassificationPractice } from "./practice";

export const metadata = { title: "动词分类训练 · 動詞活用トレーナー" };

export default function ClassifyPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <header>
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← 返回首页
        </Link>
        <h1 className="mt-5 text-2xl font-semibold">动词分类训练</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          看到辞书形，判断它是一段、五段还是不规则动词。每次都会给出判断理由。
        </p>
      </header>
      <ClassificationPractice verbs={VERBS} />
    </main>
  );
}
