// data/rules.js — 纯数据：课程 / 知识点 / 规则
//
// 规则表是完整的（含 Phase 2 的 ta / nai / tai 共 16 条，本阶段只登记不出题），
// 课程可见范围由 LESSONS 控制：Phase 1 只注册 classify / masu / te 三个知识点。
// 引擎返回的每一个 ruleId 都必须能在 RULES 里查到，不允许悬空引用。

window.JVT = window.JVT || {};

JVT.COURSES = [
  { id: 'N5', title: 'N5 动词活用', lessonIds: ['classify', 'masu', 'te'] },
];

JVT.LESSONS = [
  {
    id: 'classify',
    courseId: 'N5',
    order: 1,
    title: '动词分类',
    ruleIds: ['classify-ichidan', 'classify-godan', 'classify-godan-trap', 'classify-irregular'],
    modes: ['study', 'classify'],
  },
  {
    id: 'masu',
    courseId: 'N5',
    order: 2,
    title: 'ます形',
    ruleIds: ['masu-ichidan', 'masu-godan', 'masu-suru', 'masu-kuru'],
    modes: ['study', 'rule', 'produce', 'reverse'],
  },
  {
    // order 3 预留给 Phase 2 的 た形（SPEC §1.3 示例中 te 的 order 为 4）
    id: 'te',
    courseId: 'N5',
    order: 4,
    title: 'て形',
    ruleIds: ['te-ichidan', 'te-utsuru', 'te-mbn', 'te-ku', 'te-gu', 'te-su', 'te-iku', 'te-suru', 'te-kuru'],
    modes: ['study', 'rule', 'produce', 'reverse'],
  },
];

JVT.RULES = [
  // ───────────────── classify 动词分类（4 条） ─────────────────
  {
    id: 'classify-ichidan',
    lessonId: 'classify',
    label: 'い段/え段 + る → 一段',
    applies: { type: 'ichidan' },
    transform: null,
    answer: 'ichidan',
    note: '判定基准：る结尾，且る前假名在い段或え段（食べる・見る）。存在假冒者，见 classify-godan-trap。',
  },
  {
    id: 'classify-godan',
    lessonId: 'classify',
    label: 'う段结尾 → 五段',
    applies: { type: 'godan' },
    transform: null,
    answer: 'godan',
    note: 'う段假名（う・つ・る・む・ぶ・ぬ・く・ぐ・す）结尾。る结尾时需先排除一段与陷阱词。',
  },
  {
    id: 'classify-godan-trap',
    lessonId: 'classify',
    label: '形似一段的五段',
    applies: { type: 'godan', traps: ['ru-looks-ichidan'] },
    transform: null,
    answer: 'godan',
    note: '帰る・入る・走る・切る・知る・要る・減る・滑る・散る・参る——形式满足一段特征但实为五段，只能逐词记忆。最高频考点。',
  },
  {
    id: 'classify-irregular',
    lessonId: 'classify',
    label: 'する・来る → 不规则',
    applies: { type: ['suru', 'kuru'] },
    transform: null,
    answer: 'irregular',
    note: 'する、来る，以及「名词＋する」复合动词（勉強する等）。',
  },

  // ───────────────── masu ます形（4 条） ─────────────────
  {
    id: 'masu-ichidan',
    lessonId: 'masu',
    label: 'る → ます',
    applies: { type: 'ichidan' },
    transform: { drop: 1, add: 'ます' },
    note: '去る直接接ます：食べる→食べます。',
  },
  {
    id: 'masu-godan',
    lessonId: 'masu',
    label: 'う段 → い段 + ます',
    applies: { type: 'godan', endings: ['う', 'つ', 'る', 'む', 'ぶ', 'ぬ', 'く', 'ぐ', 'す'] },
    transform: { drop: 1, add: '(い段) + ます' },
    note: '词尾假名移到同行い段再接ます：読む→読み＋ます。配合段位尺记忆（う段→辞書形，い段→ます形）。',
  },
  {
    id: 'masu-suru',
    lessonId: 'masu',
    label: 'する → します',
    applies: { type: 'suru' },
    transform: { drop: 2, add: 'します' },
    note: '复合サ变同理：勉強する→勉強します。',
  },
  {
    id: 'masu-kuru',
    lessonId: 'masu',
    label: '来る → 来ます（きます）',
    applies: { type: 'kuru' },
    transform: null,
    note: '汉字不变、读音变化：くる→きます。カ变的读音在く/き/こ之间移动，必须整词记忆。',
  },

  // ───────────────── te て形（9 条） ─────────────────
  {
    id: 'te-ichidan',
    lessonId: 'te',
    label: 'る → て',
    applies: { type: 'ichidan' },
    transform: { drop: 1, add: 'て' },
    note: '去る直接接て：食べる→食べて。一段动词所有活用都是「去る接词尾」。',
  },
  {
    id: 'te-utsuru',
    lessonId: 'te',
    label: 'う・つ・る → って',
    applies: { type: 'godan', endings: ['う', 'つ', 'る'] },
    transform: { drop: 1, add: 'って' },
    note: '促音便。三种词尾变形结果相同，逆推时存在歧义。',
  },
  {
    id: 'te-mbn',
    lessonId: 'te',
    label: 'む・ぶ・ぬ → んで',
    applies: { type: 'godan', endings: ['む', 'ぶ', 'ぬ'] },
    transform: { drop: 1, add: 'んで' },
    note: '拨音便。む・ぶ・ぬ 三者变形结果相同，逆推时存在歧义。',
  },
  {
    id: 'te-ku',
    lessonId: 'te',
    label: 'く → いて',
    applies: { type: 'godan', endings: ['く'] },
    transform: { drop: 1, add: 'いて' },
    note: 'い音便：書く→書いて。唯一例外：行く→行って（见 te-iku）。',
  },
  {
    id: 'te-gu',
    lessonId: 'te',
    label: 'ぐ → いで',
    applies: { type: 'godan', endings: ['ぐ'] },
    transform: { drop: 1, add: 'いで' },
    note: 'い音便＋浊音保留：泳ぐ→泳いで。与く→いて成对照，写成×泳いて是高发粗心点。',
  },
  {
    id: 'te-su',
    lessonId: 'te',
    label: 'す → して',
    applies: { type: 'godan', endings: ['す'] },
    transform: { drop: 1, add: 'して' },
    note: '話す→話して。结果与ます形词干同形（話し），六条规则里最省心的一条。',
  },
  {
    id: 'te-iku',
    lessonId: 'te',
    label: '行く → 行って（特殊）',
    applies: { type: 'godan', verbIds: ['iku'] },
    transform: { drop: 1, add: 'って' },
    note: '行く不走く→いて，而是促音便：行って。必考特殊变形，走 verb.overrides。',
  },
  {
    id: 'te-suru',
    lessonId: 'te',
    label: 'する → して',
    applies: { type: 'suru' },
    transform: { drop: 2, add: 'して' },
    note: '复合サ变同理：勉強する→勉強して。',
  },
  {
    id: 'te-kuru',
    lessonId: 'te',
    label: '来る → 来て（きて）',
    applies: { type: 'kuru' },
    transform: null,
    note: '读音变化：くる→きて。',
  },

  // ───────────────── ta た形（9 条，Phase 2 出题） ─────────────────
  {
    id: 'ta-ichidan',
    lessonId: 'ta',
    label: 'る → た',
    applies: { type: 'ichidan' },
    transform: { drop: 1, add: 'た' },
    note: '食べる→食べた。た形＝て形的て/で换成た/だ。',
  },
  {
    id: 'ta-utsuru',
    lessonId: 'ta',
    label: 'う・つ・る → った',
    applies: { type: 'godan', endings: ['う', 'つ', 'る'] },
    transform: { drop: 1, add: 'った' },
    note: '促音便：買う→買った。',
  },
  {
    id: 'ta-mbn',
    lessonId: 'ta',
    label: 'む・ぶ・ぬ → んだ',
    applies: { type: 'godan', endings: ['む', 'ぶ', 'ぬ'] },
    transform: { drop: 1, add: 'んだ' },
    note: '拨音便＋浊化：読む→読んだ。注意是んだ不是んた。',
  },
  {
    id: 'ta-ku',
    lessonId: 'ta',
    label: 'く → いた',
    applies: { type: 'godan', endings: ['く'] },
    transform: { drop: 1, add: 'いた' },
    note: '書く→書いた。例外：行く→行った（见 ta-iku）。',
  },
  {
    id: 'ta-gu',
    lessonId: 'ta',
    label: 'ぐ → いだ',
    applies: { type: 'godan', endings: ['ぐ'] },
    transform: { drop: 1, add: 'いだ' },
    note: '浊化连锁：泳いで→泳いだ。注意是いだ不是いた。',
  },
  {
    id: 'ta-su',
    lessonId: 'ta',
    label: 'す → した',
    applies: { type: 'godan', endings: ['す'] },
    transform: { drop: 1, add: 'した' },
    note: '話す→話した。',
  },
  {
    id: 'ta-iku',
    lessonId: 'ta',
    label: '行く → 行った（特殊）',
    applies: { type: 'godan', verbIds: ['iku'] },
    transform: { drop: 1, add: 'った' },
    note: '与て形同理：行った，不是×行いた。走 verb.overrides。',
  },
  {
    id: 'ta-suru',
    lessonId: 'ta',
    label: 'する → した',
    applies: { type: 'suru' },
    transform: { drop: 2, add: 'した' },
    note: '勉強する→勉強した。',
  },
  {
    id: 'ta-kuru',
    lessonId: 'ta',
    label: '来る → 来た（きた）',
    applies: { type: 'kuru' },
    transform: null,
    note: '读音变化：くる→きた。',
  },

  // ───────────────── nai ない形（6 条，Phase 2 出题） ─────────────────
  {
    id: 'nai-ichidan',
    lessonId: 'nai',
    label: 'る → ない',
    applies: { type: 'ichidan' },
    transform: { drop: 1, add: 'ない' },
    note: '食べる→食べない。',
  },
  {
    id: 'nai-godan-u',
    lessonId: 'nai',
    label: 'う → わない（特殊）',
    applies: { type: 'godan', endings: ['う'] },
    transform: { drop: 1, add: 'わない' },
    note: '唯一特殊あ段：う→わ，買う→買わない，不是×買あない。单独成条，必须专门练。',
  },
  {
    id: 'nai-godan',
    lessonId: 'nai',
    label: 'う段 → あ段 + ない',
    applies: { type: 'godan', endings: ['つ', 'る', 'む', 'ぶ', 'ぬ', 'く', 'ぐ', 'す'] },
    transform: { drop: 1, add: '(あ段) + ない' },
    note: '词尾假名移到同行あ段再接ない：読む→読ま＋ない。う结尾除外（见 nai-godan-u）。',
  },
  {
    id: 'nai-suru',
    lessonId: 'nai',
    label: 'する → しない',
    applies: { type: 'suru' },
    transform: { drop: 2, add: 'しない' },
    note: '勉強する→勉強しない。',
  },
  {
    id: 'nai-kuru',
    lessonId: 'nai',
    label: '来る → 来ない（こない）',
    applies: { type: 'kuru' },
    transform: null,
    note: '读音变化：くる→こない。カ变唯一读こ段的活用。',
  },
  {
    id: 'nai-aru',
    lessonId: 'nai',
    label: 'ある → ない（特殊）',
    applies: { type: 'godan', verbIds: ['aru'] },
    transform: null,
    note: 'ある的否定不是×あらない，而是形容词ない。走 verb.overrides。',
  },

  // ───────────────── tai たい形（1 条，Phase 2 出题） ─────────────────
  {
    id: 'tai-from-masu-stem',
    lessonId: 'tai',
    label: 'ます形词干 + たい',
    applies: { type: 'any' },
    transform: null,
    note: 'たい形不按动词类型拆分：它的规则本身就是「复用ます形词干」。先掌握ます形，たい形无需新记忆——読みます→読みたい，食べます→食べたい，します→したい。',
  },
];
