import Link from "next/link";

import { N5_CORE_VERB_IDS } from "@/data/n5-core";
import { findVerb } from "@/data/verbs";
import { FORM_LABELS, type FormType } from "@/lib/conjugation";

import { FormPractice } from "./form-practice";

const COPY: Record<FormType, { description: string }> = {
  masu: { description: "把辞书形变成礼貌表达。" },
  nai: { description: "把辞书形变成普通体否定。注意「ある」特例。" },
  ta: { description: "把辞书形变成过去／完成形式，规则与て形对应。" },
  tai: { description: "把辞书形变成“想做……”的表达。" },
};

export function FormPage({ form }: { form: FormType }) {
  const verbs = N5_CORE_VERB_IDS.map((id) => findVerb(id)).filter(
    (verb) => verb !== undefined,
  );
  const copy = COPY[form];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <header>
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← 返回首页
        </Link>
        <h1 className="jp mt-5 text-2xl font-semibold">{FORM_LABELS[form]}训练</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{copy.description}</p>
      </header>
      <FormPractice verbs={verbs} form={form} />
    </main>
  );
}
