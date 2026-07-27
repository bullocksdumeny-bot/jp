import assert from "node:assert/strict";

import { findVerb } from "../src/data/verbs";
import { buildConjugationFeedback } from "../src/lib/conjugation-feedback";
import { listRuleTrainingOptions } from "../src/lib/training";

function verb(id: string) {
  const value = findVerb(id);
  assert.ok(value, `缺少动词：${id}`);
  return value;
}

const masuStem = buildConjugationFeedback(verb("nomu"), "te", "飲みて");
assert.equal(masuStem.errorType, "USED_MASU_STEM");
assert.ok(masuStem.userReason.includes("ます形词干「飲み」"));
assert.ok(masuStem.steps.includes("て形：む・ぶ・ぬ → んで"));
assert.ok(masuStem.steps.at(-1)?.includes("飲んで（のんで）"));

const iku = buildConjugationFeedback(verb("iku"), "te", "行いて");
assert.equal(iku.errorType, "SPECIAL_EXCEPTION");
assert.ok(iku.userReason.includes("不使用普通的「く→いて」"));
assert.ok(iku.steps.at(-1)?.includes("行って（いって）"));

const kaeru = buildConjugationFeedback(verb("kaeru"), "te", "帰て");
assert.equal(kaeru.errorType, "WRONG_CATEGORY");
assert.ok(kaeru.userReason.includes("五段「る」结尾"));

const aru = buildConjugationFeedback(verb("aru"), "nai", "あらない");
assert.equal(aru.errorType, "SPECIAL_EXCEPTION");
assert.ok(aru.steps.at(-1)?.endsWith("ない"));
assert.equal(aru.steps.at(-1)?.includes("あらない"), false);

const kuruMasu = buildConjugationFeedback(verb("kuru"), "masu", "来る");
assert.ok(kuruMasu.steps.at(-1)?.includes("来ます（きます）"));
const kuruNai = buildConjugationFeedback(verb("kuru"), "nai", "来る");
assert.ok(kuruNai.steps.at(-1)?.includes("来ない（こない）"));
const kuruTe = buildConjugationFeedback(verb("kuru"), "te", "来る");
assert.ok(kuruTe.steps.at(-1)?.includes("来て（きて）"));
const kuruTa = buildConjugationFeedback(verb("kuru"), "ta", "来る");
assert.ok(kuruTa.steps.at(-1)?.includes("来た（きた）"));
const kuruTai = buildConjugationFeedback(verb("kuru"), "tai", "来る");
assert.ok(kuruTai.steps.at(-1)?.includes("来たい（きたい）"));

const ruleOptions = listRuleTrainingOptions();
const nasalTe = ruleOptions.find((option) => option.ruleId === "te-mu-bu-nu");
assert.ok(nasalTe);
assert.ok(nasalTe.questionCount >= 4);

console.log("结构化错误诊断与规则专项训练验证通过。");
