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
  { id: "oshieru", dictionary: "教える", reading: "おしえる", meaning: "教", type: "ichidan", reason: "「え」在え段，去掉「る」可直接接活用词尾，是一段动词。" },
  { id: "iru-exist", dictionary: "いる", reading: "いる", meaning: "存在（有生命）", type: "ichidan", reason: "表示有生命物体存在的「いる」是一段动词；不要和五段动词「要る」混淆。" },
  { id: "shimeru", dictionary: "閉める", reading: "しめる", meaning: "关闭", type: "ichidan", reason: "「め」在え段，去掉「る」可直接接活用词尾，是一段动词。" },
  { id: "oriru", dictionary: "降りる", reading: "おりる", meaning: "下车；下来", type: "ichidan", reason: "「り」在い段，去掉「る」可直接接活用词尾，是一段动词。" },
  { id: "kiru-wear", dictionary: "着る", reading: "きる", meaning: "穿", type: "ichidan", reason: "表示“穿”的「着る」是一段动词；不要和五段动词「切る」混淆。" },
  { id: "kariru", dictionary: "借りる", reading: "かりる", meaning: "借入", type: "ichidan", reason: "「り」在い段，去掉「る」可直接接活用词尾，是一段动词。" },
  { id: "kaku", dictionary: "書く", reading: "かく", meaning: "写", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "nomu", dictionary: "飲む", reading: "のむ", meaning: "喝", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "kiku", dictionary: "聞く", reading: "きく", meaning: "听；询问", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "yomu", dictionary: "読む", reading: "よむ", meaning: "读", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "hanasu", dictionary: "話す", reading: "はなす", meaning: "说", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "iu", dictionary: "言う", reading: "いう", meaning: "说", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "au", dictionary: "会う", reading: "あう", meaning: "见面", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "uru", dictionary: "売る", reading: "うる", meaning: "卖", type: "godan", reason: "末尾「る」前是う段音，不符合一段动词外形，是五段动词。" },
  { id: "yasumu", dictionary: "休む", reading: "やすむ", meaning: "休息", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "hataraku", dictionary: "働く", reading: "はたらく", meaning: "工作", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "narau", dictionary: "習う", reading: "ならう", meaning: "学习", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "wakaru", dictionary: "分かる", reading: "わかる", meaning: "明白", type: "godan", reason: "末尾「る」前是あ段音，不符合一段动词外形，是五段动词。" },
  { id: "omou", dictionary: "思う", reading: "おもう", meaning: "想；认为", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "aru", dictionary: "ある", reading: "ある", meaning: "存在（无生命）", type: "godan", reason: "表示无生命物体存在的「ある」按五段动词活用。" },
  { id: "motsu", dictionary: "持つ", reading: "もつ", meaning: "拿；拥有", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "matsu", dictionary: "待つ", reading: "まつ", meaning: "等待", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "tatsu", dictionary: "立つ", reading: "たつ", meaning: "站立", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "suwaru", dictionary: "座る", reading: "すわる", meaning: "坐", type: "godan", reason: "末尾「る」前是あ段音，不符合一段动词外形，是五段动词。" },
  { id: "asobu", dictionary: "遊ぶ", reading: "あそぶ", meaning: "玩", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "shinu", dictionary: "死ぬ", reading: "しぬ", meaning: "死", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "kau", dictionary: "買う", reading: "かう", meaning: "买", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "aku", dictionary: "開く", reading: "あく", meaning: "打开（自动）", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "shimaru", dictionary: "閉まる", reading: "しまる", meaning: "关闭（自动）", type: "godan", reason: "末尾「る」前是あ段音，不符合一段动词外形，是五段动词。" },
  { id: "tsukau", dictionary: "使う", reading: "つかう", meaning: "使用", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "tsukuru", dictionary: "作る", reading: "つくる", meaning: "制作", type: "godan", reason: "末尾「る」前是う段音，不符合一段动词外形，是五段动词。" },
  { id: "sumu", dictionary: "住む", reading: "すむ", meaning: "居住", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "aruku", dictionary: "歩く", reading: "あるく", meaning: "走路", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "oyogu", dictionary: "泳ぐ", reading: "およぐ", meaning: "游泳", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "noru", dictionary: "乗る", reading: "のる", meaning: "乘坐", type: "godan", reason: "末尾「る」前是お段音，不符合一段动词外形，是五段动词。" },
  { id: "nugu", dictionary: "脱ぐ", reading: "ぬぐ", meaning: "脱", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "arau", dictionary: "洗う", reading: "あらう", meaning: "洗", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "toru", dictionary: "取る", reading: "とる", meaning: "拿取", type: "godan", reason: "末尾「る」前是お段音，不符合一段动词外形，是五段动词。" },
  { id: "oku", dictionary: "置く", reading: "おく", meaning: "放置", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "okuru", dictionary: "送る", reading: "おくる", meaning: "发送；送行", type: "godan", reason: "末尾「る」前是う段音，不符合一段动词外形，是五段动词。" },
  { id: "kasu", dictionary: "貸す", reading: "かす", meaning: "借出", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "kaesu", dictionary: "返す", reading: "かえす", meaning: "归还", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "yobu", dictionary: "呼ぶ", reading: "よぶ", meaning: "叫；邀请", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "utau", dictionary: "歌う", reading: "うたう", meaning: "唱歌", type: "godan", reason: "不以「る」结尾，按五十音行改变末尾假名，是五段动词。" },
  { id: "hajimaru", dictionary: "始まる", reading: "はじまる", meaning: "开始", type: "godan", reason: "末尾「る」前是あ段音，不符合一段动词外形，是五段动词。" },
  { id: "owaru", dictionary: "終わる", reading: "おわる", meaning: "结束", type: "godan", reason: "末尾「る」前是あ段音，不符合一段动词外形，是五段动词。" },
  { id: "iku", dictionary: "行く", reading: "いく", meaning: "去", type: "godan", trap: true, reason: "「行く」本身是五段动词，只有て形和た形使用需要单独记忆的促音特例。" },
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
  { id: "benkyou-suru", dictionary: "勉強する", reading: "べんきょうする", meaning: "学习", type: "irregular", reason: "「勉強する」是名词「勉強」加「する」构成的する复合动词，整体按する的不规则规则活用。" },
  { id: "kuru", dictionary: "来る", reading: "くる", meaning: "来", type: "irregular", reason: "「来る」的读音和词干会随活用变化，属于不规则动词。" },
] as const;

export function findVerb(id: string): Verb | undefined {
  return VERBS.find((verb) => verb.id === id);
}
