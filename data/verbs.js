// data/verbs.js — 纯数据：动词库（97 个）
//
// level：为满足规则覆盖收录了少量 N4/N3 词。UI 默认只出 N5+N4，N3 词留作数据备用。
// traps：陷阱标记，见 docs/SPEC.md §5，抽题权重 ×3.5。
// overrides：不规则变形，引擎优先读取，ruleId 指向 rules.js 里该动词的专属规则。

window.JVT = window.JVT || {};

JVT.VERBS = [
  // ───── 五段・う（te-utsuru / nai-godan-u） ─────
  { id: 'kau',      kanji: '買う',   kana: 'かう',    meaning: '买',           type: 'godan', level: 'N5', traps: [] },
  { id: 'au',       kanji: '会う',   kana: 'あう',    meaning: '见面',         type: 'godan', level: 'N5', traps: [] },
  { id: 'tsukau',   kanji: '使う',   kana: 'つかう',  meaning: '使用',         type: 'godan', level: 'N5', traps: [] },
  { id: 'utau',     kanji: '歌う',   kana: 'うたう',  meaning: '唱歌',         type: 'godan', level: 'N5', traps: [] },
  { id: 'arau',     kanji: '洗う',   kana: 'あらう',  meaning: '洗',           type: 'godan', level: 'N5', traps: [] },
  { id: 'narau',    kanji: '習う',   kana: 'ならう',  meaning: '学习（跟人学）', type: 'godan', level: 'N5', traps: [] },
  { id: 'tetsudau', kanji: '手伝う', kana: 'てつだう', meaning: '帮忙',         type: 'godan', level: 'N5', traps: [] },
  { id: 'iu',       kanji: '言う',   kana: 'いう',    meaning: '说',           type: 'godan', level: 'N5', traps: [] },
  { id: 'omou',     kanji: '思う',   kana: 'おもう',  meaning: '想，认为',     type: 'godan', level: 'N5', traps: [] },
  { id: 'harau',    kanji: '払う',   kana: 'はらう',  meaning: '支付',         type: 'godan', level: 'N5', traps: [] },

  // ───── 五段・つ（te-utsuru） ─────
  { id: 'matsu',    kanji: '待つ',   kana: 'まつ',    meaning: '等待',         type: 'godan', level: 'N5', traps: [] },
  { id: 'motsu',    kanji: '持つ',   kana: 'もつ',    meaning: '拿，持有',     type: 'godan', level: 'N5', traps: [] },
  { id: 'tatsu',    kanji: '立つ',   kana: 'たつ',    meaning: '站立',         type: 'godan', level: 'N5', traps: [] },
  { id: 'katsu',    kanji: '勝つ',   kana: 'かつ',    meaning: '赢',           type: 'godan', level: 'N4', traps: [] },

  // ───── 五段・る／陷阱组：形似一段（te-utsuru + ru-looks-ichidan） ─────
  { id: 'kaeru-return', kanji: '帰る', kana: 'かえる', meaning: '回去',        type: 'godan', level: 'N5', traps: ['ru-looks-ichidan'] },
  { id: 'hairu',    kanji: '入る',   kana: 'はいる',  meaning: '进入',         type: 'godan', level: 'N5', traps: ['ru-looks-ichidan'] },
  { id: 'hashiru',  kanji: '走る',   kana: 'はしる',  meaning: '跑',           type: 'godan', level: 'N5', traps: ['ru-looks-ichidan'] },
  { id: 'kiru-cut', kanji: '切る',   kana: 'きる',    meaning: '切，剪',       type: 'godan', level: 'N5', traps: ['ru-looks-ichidan', 'homophone-pair'] },
  { id: 'shiru',    kanji: '知る',   kana: 'しる',    meaning: '知道',         type: 'godan', level: 'N5', traps: ['ru-looks-ichidan'] },
  { id: 'iru-need', kanji: '要る',   kana: 'いる',    meaning: '需要',         type: 'godan', level: 'N5', traps: ['ru-looks-ichidan'] },
  { id: 'heru',     kanji: '減る',   kana: 'へる',    meaning: '减少',         type: 'godan', level: 'N4', traps: ['ru-looks-ichidan'] },
  { id: 'suberu',   kanji: '滑る',   kana: 'すべる',  meaning: '滑',           type: 'godan', level: 'N4', traps: ['ru-looks-ichidan'] },
  { id: 'chiru',    kanji: '散る',   kana: 'ちる',    meaning: '凋谢，散落',   type: 'godan', level: 'N3', traps: ['ru-looks-ichidan'] },
  { id: 'mairu',    kanji: '参る',   kana: 'まいる',  meaning: '去/来（自谦）', type: 'godan', level: 'N4', traps: ['ru-looks-ichidan'] },

  // ───── 五段・る／普通（te-utsuru） ─────
  { id: 'owaru',    kanji: '終わる', kana: 'おわる',  meaning: '结束',         type: 'godan', level: 'N5', traps: [] },
  { id: 'wakaru',   kanji: '分かる', kana: 'わかる',  meaning: '明白',         type: 'godan', level: 'N5', traps: [] },
  { id: 'noru',     kanji: '乗る',   kana: 'のる',    meaning: '乘坐',         type: 'godan', level: 'N5', traps: [] },
  { id: 'tsukuru',  kanji: '作る',   kana: 'つくる',  meaning: '制作',         type: 'godan', level: 'N5', traps: [] },
  { id: 'toru-photo', kanji: '撮る', kana: 'とる',    meaning: '拍摄',         type: 'godan', level: 'N5', traps: [] },
  { id: 'uru',      kanji: '売る',   kana: 'うる',    meaning: '卖',           type: 'godan', level: 'N5', traps: [] },
  { id: 'suwaru',   kanji: '座る',   kana: 'すわる',  meaning: '坐',           type: 'godan', level: 'N5', traps: [] },
  { id: 'toru-take', kanji: '取る',  kana: 'とる',    meaning: '取，拿',       type: 'godan', level: 'N5', traps: [] },
  {
    id: 'aru', kanji: 'ある', kana: 'ある', meaning: '有（无生命）', type: 'godan', level: 'N5', traps: [],
    overrides: { nai: { kanji: 'ない', kana: 'ない', ruleId: 'nai-aru' } },
  },

  // ───── 五段・む（te-mbn + n-ambiguous） ─────
  { id: 'yomu',     kanji: '読む',   kana: 'よむ',    meaning: '读',           type: 'godan', level: 'N5', traps: ['n-ambiguous'] },
  { id: 'nomu',     kanji: '飲む',   kana: 'のむ',    meaning: '喝',           type: 'godan', level: 'N5', traps: ['n-ambiguous'] },
  { id: 'yasumu',   kanji: '休む',   kana: 'やすむ',  meaning: '休息',         type: 'godan', level: 'N5', traps: ['n-ambiguous'] },
  { id: 'sumu',     kanji: '住む',   kana: 'すむ',    meaning: '居住',         type: 'godan', level: 'N5', traps: ['n-ambiguous'] },
  { id: 'tanomu',   kanji: '頼む',   kana: 'たのむ',  meaning: '拜托',         type: 'godan', level: 'N4', traps: ['n-ambiguous'] },

  // ───── 五段・ぶ（te-mbn + n-ambiguous） ─────
  { id: 'asobu',    kanji: '遊ぶ',   kana: 'あそぶ',  meaning: '玩',           type: 'godan', level: 'N5', traps: ['n-ambiguous'] },
  { id: 'yobu',     kanji: '呼ぶ',   kana: 'よぶ',    meaning: '叫，呼唤',     type: 'godan', level: 'N5', traps: ['n-ambiguous'] },
  { id: 'tobu',     kanji: '飛ぶ',   kana: 'とぶ',    meaning: '飞',           type: 'godan', level: 'N5', traps: ['n-ambiguous'] },
  { id: 'erabu',    kanji: '選ぶ',   kana: 'えらぶ',  meaning: '选择',         type: 'godan', level: 'N4', traps: ['n-ambiguous'] },
  { id: 'narabu',   kanji: '並ぶ',   kana: 'ならぶ',  meaning: '排队，排列',   type: 'godan', level: 'N5', traps: ['n-ambiguous'] },
  { id: 'hakobu',   kanji: '運ぶ',   kana: 'はこぶ',  meaning: '搬运',         type: 'godan', level: 'N4', traps: ['n-ambiguous'] },

  // ───── 五段・ぬ（te-mbn + n-ambiguous，日语中ぬ结尾动词仅此一个） ─────
  { id: 'shinu',    kanji: '死ぬ',   kana: 'しぬ',    meaning: '死',           type: 'godan', level: 'N5', traps: ['n-ambiguous'] },

  // ───── 五段・く（te-ku） ─────
  { id: 'kaku',     kanji: '書く',   kana: 'かく',    meaning: '写',           type: 'godan', level: 'N5', traps: ['ku-gu-voicing'] },
  { id: 'kiku',     kanji: '聞く',   kana: 'きく',    meaning: '听，问',       type: 'godan', level: 'N5', traps: [] },
  { id: 'aruku',    kanji: '歩く',   kana: 'あるく',  meaning: '走路',         type: 'godan', level: 'N5', traps: [] },
  { id: 'hataraku', kanji: '働く',   kana: 'はたらく', meaning: '工作',        type: 'godan', level: 'N5', traps: [] },
  { id: 'naku',     kanji: '泣く',   kana: 'なく',    meaning: '哭',           type: 'godan', level: 'N4', traps: [] },
  { id: 'tsuku',    kanji: '着く',   kana: 'つく',    meaning: '到达',         type: 'godan', level: 'N5', traps: ['homophone-pair'] },
  { id: 'haku',     kanji: '履く',   kana: 'はく',    meaning: '穿（鞋、裤）', type: 'godan', level: 'N5', traps: [] },
  { id: 'migaku',   kanji: '磨く',   kana: 'みがく',  meaning: '刷（牙），擦亮', type: 'godan', level: 'N5', traps: [] },
  { id: 'oku',      kanji: '置く',   kana: 'おく',    meaning: '放置',         type: 'godan', level: 'N5', traps: [] },
  { id: 'hiku',     kanji: '引く',   kana: 'ひく',    meaning: '拉，查（词典）', type: 'godan', level: 'N5', traps: [] },

  // ───── 五段・く特殊：行く（te-iku / ta-iku） ─────
  {
    id: 'iku', kanji: '行く', kana: 'いく', meaning: '去', type: 'godan', level: 'N5', traps: ['iku-special'],
    overrides: {
      te: { kanji: '行って', kana: 'いって', ruleId: 'te-iku' },
      ta: { kanji: '行った', kana: 'いった', ruleId: 'ta-iku' },
    },
  },

  // ───── 五段・ぐ（te-gu） ─────
  { id: 'oyogu',    kanji: '泳ぐ',   kana: 'およぐ',  meaning: '游泳',         type: 'godan', level: 'N5', traps: ['ku-gu-voicing'] },
  { id: 'nugu',     kanji: '脱ぐ',   kana: 'ぬぐ',    meaning: '脱',           type: 'godan', level: 'N5', traps: [] },
  { id: 'isogu',    kanji: '急ぐ',   kana: 'いそぐ',  meaning: '赶快',         type: 'godan', level: 'N5', traps: [] },
  { id: 'sawagu',   kanji: '騒ぐ',   kana: 'さわぐ',  meaning: '吵闹',         type: 'godan', level: 'N4', traps: [] },
  { id: 'fusegu',   kanji: '防ぐ',   kana: 'ふせぐ',  meaning: '防止',         type: 'godan', level: 'N3', traps: [] },
  { id: 'kasegu',   kanji: '稼ぐ',   kana: 'かせぐ',  meaning: '赚钱',         type: 'godan', level: 'N3', traps: [] },

  // ───── 五段・す（te-su） ─────
  { id: 'hanasu',   kanji: '話す',   kana: 'はなす',  meaning: '说话',         type: 'godan', level: 'N5', traps: [] },
  { id: 'kasu',     kanji: '貸す',   kana: 'かす',    meaning: '借出',         type: 'godan', level: 'N5', traps: [] },
  { id: 'kesu',     kanji: '消す',   kana: 'けす',    meaning: '关闭，消除',   type: 'godan', level: 'N5', traps: [] },
  { id: 'dasu',     kanji: '出す',   kana: 'だす',    meaning: '拿出，提交',   type: 'godan', level: 'N5', traps: [] },
  { id: 'osu',      kanji: '押す',   kana: 'おす',    meaning: '按，推',       type: 'godan', level: 'N5', traps: [] },
  { id: 'kaesu',    kanji: '返す',   kana: 'かえす',  meaning: '归还',         type: 'godan', level: 'N5', traps: [] },
  { id: 'watasu',   kanji: '渡す',   kana: 'わたす',  meaning: '交给',         type: 'godan', level: 'N5', traps: [] },
  { id: 'sagasu',   kanji: '探す',   kana: 'さがす',  meaning: '寻找',         type: 'godan', level: 'N4', traps: [] },
  { id: 'naosu',    kanji: '直す',   kana: 'なおす',  meaning: '修改，修理',   type: 'godan', level: 'N4', traps: [] },

  // ───── 一段（te-ichidan） ─────
  { id: 'taberu',   kanji: '食べる', kana: 'たべる',  meaning: '吃',           type: 'ichidan', level: 'N5', traps: [] },
  { id: 'miru',     kanji: '見る',   kana: 'みる',    meaning: '看',           type: 'ichidan', level: 'N5', traps: [] },
  { id: 'neru',     kanji: '寝る',   kana: 'ねる',    meaning: '睡觉',         type: 'ichidan', level: 'N5', traps: [] },
  { id: 'okiru',    kanji: '起きる', kana: 'おきる',  meaning: '起床',         type: 'ichidan', level: 'N5', traps: [] },
  { id: 'kiru-wear', kanji: '着る',  kana: 'きる',    meaning: '穿（上衣）',   type: 'ichidan', level: 'N5', traps: ['homophone-pair'] },
  { id: 'deru',     kanji: '出る',   kana: 'でる',    meaning: '出去，出来',   type: 'ichidan', level: 'N5', traps: [] },
  { id: 'akeru',    kanji: '開ける', kana: 'あける',  meaning: '打开',         type: 'ichidan', level: 'N5', traps: [] },
  { id: 'shimeru',  kanji: '閉める', kana: 'しめる',  meaning: '关闭',         type: 'ichidan', level: 'N5', traps: [] },
  { id: 'oshieru',  kanji: '教える', kana: 'おしえる', meaning: '教',          type: 'ichidan', level: 'N5', traps: [] },
  { id: 'oboeru',   kanji: '覚える', kana: 'おぼえる', meaning: '记住',        type: 'ichidan', level: 'N5', traps: [] },
  { id: 'wasureru', kanji: '忘れる', kana: 'わすれる', meaning: '忘记',        type: 'ichidan', level: 'N5', traps: [] },
  { id: 'kariru',   kanji: '借りる', kana: 'かりる',  meaning: '借入',         type: 'ichidan', level: 'N5', traps: [] },
  { id: 'abiru',    kanji: '浴びる', kana: 'あびる',  meaning: '淋浴',         type: 'ichidan', level: 'N5', traps: [] },
  { id: 'miseru',   kanji: '見せる', kana: 'みせる',  meaning: '给…看',        type: 'ichidan', level: 'N5', traps: [] },
  { id: 'oriru',    kanji: '降りる', kana: 'おりる',  meaning: '下（车）',     type: 'ichidan', level: 'N5', traps: [] },
  { id: 'ireru',    kanji: '入れる', kana: 'いれる',  meaning: '放入',         type: 'ichidan', level: 'N5', traps: [] },
  { id: 'suteru',   kanji: '捨てる', kana: 'すてる',  meaning: '扔掉',         type: 'ichidan', level: 'N4', traps: [] },
  { id: 'kotaeru',  kanji: '答える', kana: 'こたえる', meaning: '回答',        type: 'ichidan', level: 'N5', traps: [] },

  // ───── 不规则（te-suru / te-kuru） ─────
  { id: 'suru',     kanji: 'する',   kana: 'する',    meaning: '做',           type: 'suru', level: 'N5', traps: [] },
  { id: 'kuru',     kanji: '来る',   kana: 'くる',    meaning: '来',           type: 'kuru', level: 'N5', traps: [] },
  { id: 'benkyou-suru', kanji: '勉強する', kana: 'べんきょうする', meaning: '学习', type: 'suru', level: 'N5', traps: ['suru-compound'] },
  { id: 'sanpo-suru',   kanji: '散歩する', kana: 'さんぽする',    meaning: '散步', type: 'suru', level: 'N5', traps: ['suru-compound'] },
  { id: 'denwa-suru',   kanji: '電話する', kana: 'でんわする',    meaning: '打电话', type: 'suru', level: 'N5', traps: ['suru-compound'] },
  { id: 'souji-suru',   kanji: '掃除する', kana: 'そうじする',    meaning: '打扫', type: 'suru', level: 'N5', traps: ['suru-compound'] },
  { id: 'kaimono-suru', kanji: '買い物する', kana: 'かいものする', meaning: '购物', type: 'suru', level: 'N5', traps: ['suru-compound'] },
  { id: 'renshuu-suru', kanji: '練習する', kana: 'れんしゅうする', meaning: '练习', type: 'suru', level: 'N5', traps: ['suru-compound'] },
];
