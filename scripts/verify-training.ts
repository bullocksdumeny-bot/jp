import assert from "node:assert/strict";

import { N5_CORE_VERB_IDS } from "../src/data/n5-core";
import { findTeForm } from "../src/data/te-forms";
import { findVerb } from "../src/data/verbs";
import { conjugate, FORM_TYPES } from "../src/lib/conjugation";
import {
  buildTargetedQuestions,
  kindFromRuleId,
  QUESTION_KINDS,
  routeForKind,
  ruleIdForQuestion,
  ruleLabel,
} from "../src/lib/training";

assert.equal(kindFromRuleId("skill-classify"), "classify");

for (const id of N5_CORE_VERB_IDS) {
  const verb = findVerb(id);
  assert.ok(verb);
  const te = findTeForm(id);
  assert.ok(te);
  assert.equal(kindFromRuleId(te.ruleId), "te");
  assert.notEqual(ruleLabel(te.ruleId), te.ruleId);

  for (const form of FORM_TYPES) {
    const result = conjugate(verb, form);
    assert.equal(kindFromRuleId(result.ruleId), form);
    assert.notEqual(ruleLabel(result.ruleId), result.ruleId);
  }
}

for (const kind of QUESTION_KINDS) {
  assert.ok(routeForKind(kind).startsWith("/"));
}

const targeted = buildTargetedQuestions(["te-ku", "nai-aru"], 3);
assert.equal(targeted.length, 4);
assert.deepEqual(
  [...new Set(targeted.map((question) => ruleIdForQuestion(question)))],
  ["te-ku", "nai-aru"],
);

console.log("综合训练规则映射验证通过。");
