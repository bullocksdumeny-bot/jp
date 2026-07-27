import assert from "node:assert/strict";

import { VERBS } from "../src/data/verbs";
import { N5_CORE_VERB_IDS } from "../src/data/n5-core";
import { classifyVerb, explainClassification } from "../src/lib/classification";

assert.equal(N5_CORE_VERB_IDS.length, 61);
assert.equal(new Set(N5_CORE_VERB_IDS).size, 61);
assert.ok(VERBS.length >= 61);
assert.equal(new Set(VERBS.map((verb) => verb.id)).size, VERBS.length);
assert.ok(VERBS.filter((verb) => verb.trap).length >= 9);

for (const id of N5_CORE_VERB_IDS) {
  assert.ok(VERBS.some((verb) => verb.id === id), `缺少 N5 核心动词：${id}`);
}

for (const verb of VERBS) {
  assert.equal(classifyVerb(verb), verb.type);
  assert.ok(explainClassification(verb).includes(verb.dictionary));
}

console.log(`动词分类数据验证通过：${VERBS.length} 个动词。`);
