import assert from "node:assert/strict";

import { N5_CORE_VERB_IDS } from "../src/data/n5-core";
import { findVerb } from "../src/data/verbs";
import { conjugate, FORM_TYPES } from "../src/lib/conjugation";

for (const id of N5_CORE_VERB_IDS) {
  const verb = findVerb(id);
  assert.ok(verb, `缺少动词：${id}`);
  for (const form of FORM_TYPES) {
    const result = conjugate(verb, form);
    assert.ok(result.answer.length > 0, `${id} 缺少 ${form}`);
    assert.ok(result.ruleId.startsWith(`${form}-`));
    assert.ok(result.explanation.endsWith(result.answer));
  }
}

const cases = [
  ["kaku", "masu", "書きます"],
  ["kau", "nai", "買わない"],
  ["aru", "nai", "ない"],
  ["yomu", "ta", "読んだ"],
  ["iku", "ta", "行った"],
  ["suru", "tai", "したい"],
  ["kuru", "masu", "来ます"],
] as const;

for (const [id, form, expected] of cases) {
  const verb = findVerb(id);
  assert.ok(verb);
  assert.equal(conjugate(verb, form).answer, expected);
}

console.log(`四类活用验证通过：${N5_CORE_VERB_IDS.length} 个 N5 动词。`);
