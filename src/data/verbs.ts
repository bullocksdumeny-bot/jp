export const VERB_TYPES = ["ichidan", "godan", "irregular"] as const;
export type VerbType = (typeof VERB_TYPES)[number];

export type Verb = {
  id: string;
  dictionary: string;
  reading: string;
  meaning: string;
  type: VerbType;
  trap?: boolean;
  reason: string;
};

export const VERBS: readonly Verb[] = [
  { id: "taberu", dictionary: "食べる", reading: "たべる", meaning: "吃", type: "ichidan", reason: "「べ」在え段，去掉「る」可直接接活用词尾，是典型一段动词。" },
  { id: "miru", dictionary: "見る", reading: "みる", meaning: "看", type: "ichidan", reason: "「み」在い段，去掉「る」可直接接活用词尾，是一段动词。" },
  { id: "okiru", dictionary: "起きる", reading: "おきる", meaning: "起床", type: "ichidan", reason: "「き」在い段，去掉「る」可直接接活用词尾，是一段动词。" },
  { id: "neru", dictionary: "寝る", reading: "ねる", meaning: "睡觉", type: "ichidan", reason: "「ね」在え段，去掉「る」可直接接活用词尾，是一段动词。" },
  { id: "akeru", dictionary: "開ける", reading: "あける", meaning: "打开", type: "ichidan", reason: "「け」在え段，去掉「る」可直接接活用词尾，是一段动词。" },
  { id: "deru", dictionary: "出る", reading: "でる", meaning: "出去", type: "ichidan", reason: "「で」在え段，去掉「る」可直接接活用词尾，是一段动词。" },
  { id: "kaku", dictionary: "書く", reading: "かく", meaning: "写", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "yomu", dictionary: "読む", reading: "よむ", meaning: "读", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "hanasu", dictionary: "話す", reading: "はなす", meaning: "说", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "matsu", dictionary: "待つ", reading: "まつ", meaning: "等待", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "asobu", dictionary: "遊ぶ", reading: "あそぶ", meaning: "玩", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "shinu", dictionary: "死ぬ", reading: "しぬ", meaning: "死", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "kau", dictionary: "買う", reading: "かう", meaning: "买", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "oyogu", dictionary: "泳ぐ", reading: "およぐ", meaning: "游泳", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "iku", dictionary: "行く", reading: "いく", meaning: "去", type: "godan", trap: true, reason: "「行く」本身是五段动词，但它的て形是需要单独记忆的特例。" },
  { id: "kaeru", dictionary: "帰る", reading: "かえる", meaning: "回去", type: "godan", trap: true, reason: "虽然是「え段＋る」的外形，但「帰る」是必须单独记住的五段陷阱动词。" },
  { id: "hairu", dictionary: "入る", reading: "はいる", meaning: "进入", type: "godan", trap: true, reason: "虽然是「い段＋る」的外形，但「入る」是五段陷阱动词。" },
  { id: "hashiru", dictionary: "走る", reading: "はしる", meaning: "跑", type: "godan", trap: true, reason: "虽然是「い段＋る」的外形，但「走る」是五段陷阱动词。" },
  { id: "shiru", dictionary: "知る", reading: "しる", meaning: "知道", type: "godan", trap: true, reason: "虽然是「い段＋る」的外形，但「知る」是五段陷阱动词。" },
  { id: "iru-need", dictionary: "要る", reading: "いる", meaning: "需要", type: "godan", trap: true, reason: "「要る」是五段动词；注意不要和表示“存在”的一段动词「いる」混淆。" },
  { id: "kiru-cut", dictionary: "切る", reading: "きる", meaning: "切", type: "godan", trap: true, reason: "「切る」是五段动词；不要和表示“穿”的一段动词「着る」混淆。" },
  { id: "suberu", dictionary: "滑る", reading: "すべる", meaning: "滑", type: "godan", trap: true, reason: "虽然是「え段＋る」的外形，但「滑る」是五段陷阱动词。" },
  { id: "teru", dictionary: "照る", reading: "てる", meaning: "照耀", type: "godan", trap: true, reason: "虽然是「え段＋る」的外形，但「照る」是五段陷阱动词。" },
  { id: "nigiru", dictionary: "握る", reading: "にぎる", meaning: "握", type: "godan", trap: true, reason: "虽然是「い段＋る」的外形，但「握る」是五段陷阱动词。" },
  { id: "suru", dictionary: "する", reading: "する", meaning: "做", type: "irregular", reason: "「する」的活用不遵循一段或五段规则，属于不规则动词。" },
  { id: "kuru", dictionary: "来る", reading: "くる", meaning: "来", type: "irregular", reason: "「来る」的读音和词干会随活用变化，属于不规则动词。" },
] as const;

export function findVerb(id: string): Verb | undefined {
  return VERBS.find((verb) => verb.id === id);
}
