import assert from "node:assert/strict";

import { VERBS } from "../src/data/verbs";
import { classifyVerb, explainClassification } from "../src/lib/classification";

assert.equal(VERBS.length, 25);
assert.equal(new Set(VERBS.map((verb) => verb.id)).size, VERBS.length);
assert.ok(VERBS.filter((verb) => verb.trap).length >= 9);

for (const verb of VERBS) {
  assert.equal(classifyVerb(verb), verb.type);
  assert.ok(explainClassification(verb).includes(verb.dictionary));
}

console.log(`动词分类数据验证通过：${VERBS.length} 个动词。`);
