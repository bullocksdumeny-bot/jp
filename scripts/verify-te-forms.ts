import assert from "node:assert/strict";

import { TE_FORMS, TE_RULES, explainTeForm } from "../src/data/te-forms";
import { VERBS } from "../src/data/verbs";

assert.equal(TE_FORMS.length, VERBS.length);
assert.equal(new Set(TE_FORMS.map((entry) => entry.verbId)).size, VERBS.length);

const ruleIds = new Set(TE_RULES.map((rule) => rule.id));
for (const entry of TE_FORMS) {
  assert.ok(ruleIds.has(entry.ruleId), `未知规则：${entry.ruleId}`);
  assert.ok(entry.answer.endsWith("て") || entry.answer.endsWith("で"));
  assert.ok(explainTeForm(entry).endsWith(entry.answer));
}

assert.equal(TE_FORMS.find((entry) => entry.verbId === "iku")?.answer, "行って");
console.log(`て形数据验证通过：${TE_FORMS.length} 个动词，${TE_RULES.length} 条规则。`);
