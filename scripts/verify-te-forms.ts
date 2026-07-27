import assert from "node:assert/strict";

import {
  TE_FORMS,
  TE_RULES,
  explainTeForm,
  hintTeForm,
  teFormReading,
} from "../src/data/te-forms";
import { N5_CORE_VERB_IDS } from "../src/data/n5-core";

assert.equal(TE_FORMS.length, N5_CORE_VERB_IDS.length);
assert.equal(
  new Set(TE_FORMS.map((entry) => entry.verbId)).size,
  N5_CORE_VERB_IDS.length,
);
for (const id of N5_CORE_VERB_IDS) {
  assert.ok(TE_FORMS.some((entry) => entry.verbId === id), `缺少 N5 て形：${id}`);
}

const ruleIds = new Set(TE_RULES.map((rule) => rule.id));
for (const entry of TE_FORMS) {
  assert.ok(ruleIds.has(entry.ruleId), `未知规则：${entry.ruleId}`);
  assert.ok(entry.answer.endsWith("て") || entry.answer.endsWith("で"));
  assert.ok(explainTeForm(entry).includes(entry.answer));
  assert.ok(explainTeForm(entry).includes(teFormReading(entry)));
  assert.equal(hintTeForm(entry).includes(entry.answer), false);
  assert.equal(
    /发生特殊变化|使用专用变化|发生专用变化/.test(hintTeForm(entry)),
    false,
  );
  assert.ok(explainTeForm(entry).split("→").length >= 4);
}

assert.equal(TE_FORMS.find((entry) => entry.verbId === "iku")?.answer, "行って");
const iku = TE_FORMS.find((entry) => entry.verbId === "iku")!;
assert.ok(hintTeForm(iku).includes("不使用普通的「く→いて」"));
assert.ok(explainTeForm(iku).includes("行って（いって）"));

const kuru = TE_FORMS.find((entry) => entry.verbId === "kuru")!;
assert.ok(hintTeForm(kuru).includes("来（き）"));
assert.ok(explainTeForm(kuru).includes("来て（きて）"));

const suru = TE_FORMS.find((entry) => entry.verbId === "suru")!;
assert.ok(hintTeForm(suru).includes("「し」＋「て」"));

const benkyouSuru = TE_FORMS.find(
  (entry) => entry.verbId === "benkyou-suru",
)!;
assert.ok(hintTeForm(benkyouSuru).includes("勉強し（べんきょうし）"));
assert.ok(explainTeForm(benkyouSuru).includes("勉強して（べんきょうして）"));

for (const [id, group] of [
  ["kaku", "く → いて"],
  ["oyogu", "ぐ → いで"],
  ["hanasu", "す → して"],
  ["matsu", "う・つ・る → って"],
  ["shinu", "む・ぶ・ぬ → んで"],
  ["asobu", "む・ぶ・ぬ → んで"],
  ["nomu", "む・ぶ・ぬ → んで"],
  ["kau", "う・つ・る → って"],
  ["kaeru", "う・つ・る → って"],
] as const) {
  const entry = TE_FORMS.find((item) => item.verbId === id);
  assert.ok(entry);
  assert.ok(hintTeForm(entry).includes(group));
}
console.log(`て形数据验证通过：${TE_FORMS.length} 个动词，${TE_RULES.length} 条规则。`);
