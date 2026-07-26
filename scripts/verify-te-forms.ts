import assert from "node:assert/strict";

import { TE_FORMS, TE_RULES, explainTeForm } from "../src/data/te-forms";
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
  assert.ok(explainTeForm(entry).endsWith(entry.answer));
}

assert.equal(TE_FORMS.find((entry) => entry.verbId === "iku")?.answer, "行って");
console.log(`て形数据验证通过：${TE_FORMS.length} 个动词，${TE_RULES.length} 条规则。`);
