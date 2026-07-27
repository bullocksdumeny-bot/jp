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
    assert.ok(result.answerReading.length > 0, `${id} 缺少 ${form} 读音`);
    assert.ok(result.ruleId.startsWith(`${form}-`));
    assert.ok(result.hint.includes(verb.dictionary));
    assert.ok(result.explanation.includes(result.answer));
    assert.ok(result.explanation.includes(verb.reading));
    assert.equal(
      /发生特殊变化|使用专用变化|发生专用变化/.test(result.hint),
      false,
    );
    assert.ok(result.explanation.split("→").length >= 4);
    if (result.answer !== result.answerReading) {
      assert.ok(
        result.explanation.includes(
          `${result.answer}（${result.answerReading}）`,
        ),
      );
    }
  }
}

const cases = [
  ["taberu", "masu", "食べます", "たべます"],
  ["taberu", "nai", "食べない", "たべない"],
  ["taberu", "ta", "食べた", "たべた"],
  ["taberu", "tai", "食べたい", "たべたい"],
  ["kaku", "masu", "書きます", "かきます"],
  ["kau", "nai", "買わない", "かわない"],
  ["aru", "nai", "ない", "ない"],
  ["yomu", "ta", "読んだ", "よんだ"],
  ["iku", "ta", "行った", "いった"],
  ["suru", "masu", "します", "します"],
  ["suru", "nai", "しない", "しない"],
  ["suru", "ta", "した", "した"],
  ["suru", "tai", "したい", "したい"],
  ["kuru", "masu", "来ます", "きます"],
  ["kuru", "nai", "来ない", "こない"],
  ["kuru", "ta", "来た", "きた"],
  ["kuru", "tai", "来たい", "きたい"],
] as const;

for (const [id, form, expected, reading] of cases) {
  const verb = findVerb(id);
  assert.ok(verb);
  const result = conjugate(verb, form);
  assert.equal(result.answer, expected);
  assert.equal(result.answerReading, reading);
}

const benkyouSuru = findVerb("benkyou-suru");
assert.ok(benkyouSuru);
assert.deepEqual(
  FORM_TYPES.map((form) => conjugate(benkyouSuru, form).answer),
  ["勉強します", "勉強しない", "勉強した", "勉強したい"],
);
assert.ok(conjugate(benkyouSuru, "masu").hint.includes("勉強し（べんきょうし）"));

for (const id of [
  "kaku",
  "oyogu",
  "hanasu",
  "matsu",
  "shinu",
  "asobu",
  "nomu",
  "kau",
  "kaeru",
] as const) {
  const verb = findVerb(id);
  assert.ok(verb);
  for (const form of FORM_TYPES) {
    const result = conjugate(verb, form);
    assert.ok(result.hint.includes("五段动词"));
    assert.ok(result.explanation.includes("五段动词"));
  }
}

assert.ok(conjugate(findVerb("kuru")!, "masu").hint.includes("来（き）"));
assert.ok(conjugate(findVerb("kuru")!, "nai").hint.includes("来（こ）"));
assert.ok(conjugate(findVerb("kuru")!, "ta").hint.includes("来（き）"));
assert.ok(conjugate(findVerb("kuru")!, "tai").hint.includes("来（き）"));
assert.ok(conjugate(findVerb("aru")!, "nai").explanation.includes("不使用「あらない」"));
assert.equal(conjugate(findVerb("aru")!, "nai").explanation.includes("あらない →"), false);
assert.ok(conjugate(findVerb("iku")!, "ta").hint.includes("不使用普通的「く→いた」"));
assert.equal(conjugate(findVerb("iku")!, "masu").ruleId, "masu-godan-く");
assert.equal(conjugate(findVerb("iku")!, "nai").ruleId, "nai-godan-く");
assert.equal(conjugate(findVerb("iku")!, "tai").ruleId, "tai-godan-く");
assert.equal(findVerb("kaeru")!.type, "godan");
assert.ok(conjugate(findVerb("kaeru")!, "masu").hint.includes("る"));

for (const [id, form, formula] of [
  ["matsu", "ta", "う・つ・る → った"],
  ["shinu", "ta", "む・ぶ・ぬ → んだ"],
  ["asobu", "ta", "む・ぶ・ぬ → んだ"],
  ["nomu", "ta", "む・ぶ・ぬ → んだ"],
  ["kaku", "ta", "く → いた"],
  ["oyogu", "ta", "ぐ → いだ"],
  ["hanasu", "ta", "す → した"],
] as const) {
  const verb = findVerb(id);
  assert.ok(verb);
  assert.ok(conjugate(verb, form).hint.includes(formula));
}

console.log(`四类活用验证通过：${N5_CORE_VERB_IDS.length} 个 N5 动词。`);
