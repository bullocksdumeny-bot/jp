import Link from "next/link";

import { TE_FORMS } from "@/data/te-forms";
import { findVerb } from "@/data/verbs";

import { TeFormPractice } from "./practice";

export const metadata = { title: "て形训练 · 動詞活用トレーナー" };

export default function TeFormPage() {
  const verbs = TE_FORMS.map((entry) => findVerb(entry.verbId)).filter(
    (verb) => verb !== undefined,
  );

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <header>
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← 返回首页
        </Link>
        <h1 className="jp mt-5 text-2xl font-semibold">て形输出训练</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          看辞书形，直接写出て形。写错时会显示完整变形链。
        </p>
      </header>
      <TeFormPractice verbs={verbs} />
    </main>
  );
}
