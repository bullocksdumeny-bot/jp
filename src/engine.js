// src/engine.js — 活用引擎
//
// JVT.conjugate(verb, form) 按 docs/SPEC.md §2 实现。
// 引擎中唯一硬编码的部分：五段映射表、一段/サ变词尾表、カ变专用表（SPEC §2.2 明确允许）。
// 不含任何针对具体动词的分支——不规则动词一律走 verb.overrides（数据驱动）。
// 汉字形与假名形共用同一套「切掉词尾 + 接新词尾」逻辑。
//
// 加载顺序依赖：data/rules.js → data/verbs.js → src/engine.js → tests/golden.js

(function () {
  'use strict';

  const JVT = window.JVT = window.JVT || {};

  const FORMS = ['dict', 'masu', 'te', 'ta', 'nai', 'tai'];

  const RULE_BY_ID = {};
  JVT.RULES.forEach(function (r) { RULE_BY_ID[r.id] = r; });

  // 五段映射表（SPEC §2.2）：masu/nai 为替换假名（后续再接ます/ない），te/ta 为完整词尾
  const GODAN_ROW = {
    'う': { masu: 'い', nai: 'わ', te: 'って', ta: 'った', group: 'utsuru' },
    'つ': { masu: 'ち', nai: 'た', te: 'って', ta: 'った', group: 'utsuru' },
    'る': { masu: 'り', nai: 'ら', te: 'って', ta: 'った', group: 'utsuru' },
    'む': { masu: 'み', nai: 'ま', te: 'んで', ta: 'んだ', group: 'mbn' },
    'ぶ': { masu: 'び', nai: 'ば', te: 'んで', ta: 'んだ', group: 'mbn' },
    'ぬ': { masu: 'に', nai: 'な', te: 'んで', ta: 'んだ', group: 'mbn' },
    'く': { masu: 'き', nai: 'か', te: 'いて', ta: 'いた', group: 'ku' },
    'ぐ': { masu: 'ぎ', nai: 'が', te: 'いで', ta: 'いだ', group: 'gu' },
    'す': { masu: 'し', nai: 'さ', te: 'して', ta: 'した', group: 'su' },
  };

  const ICHIDAN_SUFFIX = { masu: 'ます', te: 'て', ta: 'た', nai: 'ない' };
  const SURU_SUFFIX = { masu: 'します', te: 'して', ta: 'した', nai: 'しない' };

  // カ变专用表（SPEC §2.2 第 3 步）：汉字「来」不变，假名读音在き/こ之间移动
  const KURU_TABLE = {
    masu: { kanji: '来ます', kana: 'きます' },
    te: { kanji: '来て', kana: 'きて' },
    ta: { kanji: '来た', kana: 'きた' },
    nai: { kanji: '来ない', kana: 'こない' },
  };

  const TYPE_LABEL = {
    godan: '五段动词',
    ichidan: '一段动词',
    suru: 'サ变动词（不规则）',
    kuru: 'カ变动词（不规则）',
  };

  function ruleLabel(ruleId) {
    return RULE_BY_ID[ruleId] ? RULE_BY_ID[ruleId].label : ruleId;
  }

  function typeStep(verb) {
    let why;
    if (verb.type === 'godan') {
      why = verb.traps.indexOf('ru-looks-ichidan') >= 0
        ? 'る结尾且前接い/え段，形似一段，实为五段（需逐词记忆）'
        : 'う段结尾，且非一段/不规则';
    } else if (verb.type === 'ichidan') {
      why = 'る结尾，且る前假名为い段/え段';
    } else {
      why = '不规则动词';
    }
    return { step: '动词类型', value: TYPE_LABEL[verb.type], why: why };
  }

  function ruleStep(ruleId) {
    return { step: '适用规则', value: ruleLabel(ruleId), ruleId: ruleId };
  }

  function conjugate(verb, form) {
    if (FORMS.indexOf(form) < 0) {
      throw new Error('未知形态: ' + form);
    }

    if (form === 'dict') {
      return {
        kanji: verb.kanji,
        kana: verb.kana,
        ruleId: null,
        chain: [{ step: '词典形', value: verb.kanji }],
      };
    }

    // 1. overrides 优先（SPEC §2.2 第 1 步）
    const ov = verb.overrides && verb.overrides[form];
    if (ov) {
      return {
        kanji: ov.kanji,
        kana: ov.kana,
        ruleId: ov.ruleId,
        chain: [
          { step: '词典形', value: verb.kanji },
          typeStep(verb),
          ruleStep(ov.ruleId),
          { step: '结果', value: ov.kanji },
        ],
      };
    }

    // 2. たい形 = ます形词干 + たい，不按动词类型分支
    if (form === 'tai') {
      return conjugateTai(verb);
    }

    switch (verb.type) {
      case 'suru':
        return conjugateSuru(verb, form);
      case 'kuru':
        return conjugateKuru(verb, form);
      case 'ichidan':
        return conjugateIchidan(verb, form);
      case 'godan':
        return conjugateGodan(verb, form);
      default:
        throw new Error('未知动词类型: ' + verb.type);
    }
  }

  function conjugateTai(verb) {
    const masu = conjugate(verb, 'masu');
    const stemKanji = masu.kanji.slice(0, -2);
    const stemKana = masu.kana.slice(0, -2);
    const ruleId = 'tai-from-masu-stem';
    return {
      kanji: stemKanji + 'たい',
      kana: stemKana + 'たい',
      ruleId: ruleId,
      chain: [
        { step: '词典形', value: verb.kanji },
        typeStep(verb),
        { step: 'ます形词干', value: stemKanji, why: 'たい形复用ます形词干' },
        ruleStep(ruleId),
        { step: '拼接', value: stemKanji + ' + たい' },
        { step: '结果', value: stemKanji + 'たい' },
      ],
    };
  }

  function conjugateSuru(verb, form) {
    const suffix = SURU_SUFFIX[form];
    const stemKanji = verb.kanji.slice(0, -2);
    const stemKana = verb.kana.slice(0, -2);
    const ruleId = form + '-suru';
    return {
      kanji: stemKanji + suffix,
      kana: stemKana + suffix,
      ruleId: ruleId,
      chain: [
        { step: '词典形', value: verb.kanji },
        typeStep(verb),
        ruleStep(ruleId),
        { step: '拼接', value: stemKanji ? stemKanji + ' + ' + suffix : suffix },
        { step: '结果', value: stemKanji + suffix },
      ],
    };
  }

  function conjugateKuru(verb, form) {
    const t = KURU_TABLE[form];
    const ruleId = form + '-kuru';
    return {
      kanji: t.kanji,
      kana: t.kana,
      ruleId: ruleId,
      chain: [
        { step: '词典形', value: verb.kanji },
        typeStep(verb),
        ruleStep(ruleId),
        { step: '结果', value: t.kanji, why: '读音：' + t.kana },
      ],
    };
  }

  function conjugateIchidan(verb, form) {
    const suffix = ICHIDAN_SUFFIX[form];
    const stemKanji = verb.kanji.slice(0, -1);
    const stemKana = verb.kana.slice(0, -1);
    const ruleId = form + '-ichidan';
    return {
      kanji: stemKanji + suffix,
      kana: stemKana + suffix,
      ruleId: ruleId,
      chain: [
        { step: '词典形', value: verb.kanji },
        typeStep(verb),
        ruleStep(ruleId),
        { step: '拼接', value: stemKanji + ' + ' + suffix },
        { step: '结果', value: stemKanji + suffix },
      ],
    };
  }

  function conjugateGodan(verb, form) {
    const ending = verb.kana.slice(-1);
    const row = GODAN_ROW[ending];
    if (!row) {
      throw new Error('五段动词词尾不在映射表中: ' + verb.kanji + '（' + ending + '）');
    }

    let suffix;
    let ruleId;
    if (form === 'masu') {
      suffix = row.masu + 'ます';
      ruleId = 'masu-godan';
    } else if (form === 'nai') {
      suffix = row.nai + 'ない';
      ruleId = ending === 'う' ? 'nai-godan-u' : 'nai-godan';
    } else {
      suffix = row[form];
      ruleId = form + '-' + row.group;
    }

    const stemKanji = verb.kanji.slice(0, -1);
    const stemKana = verb.kana.slice(0, -1);
    return {
      kanji: stemKanji + suffix,
      kana: stemKana + suffix,
      ruleId: ruleId,
      chain: [
        { step: '词典形', value: verb.kanji },
        typeStep(verb),
        { step: '词尾', value: ending },
        ruleStep(ruleId),
        { step: '拼接', value: stemKanji + ' + ' + suffix },
        { step: '结果', value: stemKanji + suffix },
      ],
    };
  }

  // ─────────────────────────── selfTest ───────────────────────────
  // 在浏览器控制台运行 JVT.selfTest()，流程：
  //   0. 黄金断言（tests/golden.js）——任何一条失败则红色大字报错并停止后续输出
  //   表1 同类对照组（相邻排列，便于肉眼对比）
  //   表2 全部动词 × 全部形态（⚠ 前缀 = traps 非空，重点核对）
  //   表3 假名形与汉字形不同步检查表（读音发生变化的动词）
  //   数据一致性检查（悬空 ruleId / lesson 引用 / て形规则覆盖数）

  const CONTRAST_GROUPS = [
    { group: '着る/着く/切る（同音异类）', ids: ['kiru-wear', 'tsuku', 'kiru-cut'] },
    { group: '書く/泳ぐ（く・ぐ浊化对照）', ids: ['kaku', 'oyogu'] },
    { group: '読む/遊ぶ/死ぬ（んで歧义）', ids: ['yomu', 'asobu', 'shinu'] },
    { group: '帰る/借りる（假一段 vs 真一段）', ids: ['kaeru-return', 'kariru'] },
    { group: '行く/書く（く行特殊 vs 常规）', ids: ['iku', 'kaku'] },
    { group: '来る/する（两大不规则）', ids: ['kuru', 'suru'] },
  ];

  const CONJUGATED_FORMS = ['masu', 'te', 'ta', 'nai', 'tai'];

  function formCell(verb, form) {
    const r = conjugate(verb, form);
    return r.kanji === r.kana ? r.kanji : r.kanji + '｜' + r.kana;
  }

  // 假名同步检查：用「汉字形结果」按词干替换推出期望假名，与实际假名比对。
  // 期望不一致 = 读音发生了变化（来る一类），需要人工重点核对。
  function kanaSyncIssues(verb) {
    const dropLen = verb.type === 'suru' ? 2 : 1;
    const kanjiStem = verb.kanji.slice(0, -dropLen);
    const kanaStem = verb.kana.slice(0, -dropLen);
    const issues = [];
    for (const form of CONJUGATED_FORMS) {
      const r = conjugate(verb, form);
      if (r.kanji.indexOf(kanjiStem) === 0) {
        const expectedKana = kanaStem + r.kanji.slice(kanjiStem.length);
        if (expectedKana !== r.kana) {
          issues.push({ 动词: verb.kanji + '（' + verb.kana + '）', 形态: form, 汉字形: r.kanji, 假名形: r.kana });
        }
      } else if (r.kanji !== r.kana) {
        issues.push({ 动词: verb.kanji + '（' + verb.kana + '）', 形态: form, 汉字形: r.kanji, 假名形: r.kana });
      }
    }
    return issues;
  }

  function selfTest() {
    // 0. 黄金断言：失败即中止
    if (typeof JVT.runGoldenAssertions === 'function') {
      const golden = JVT.runGoldenAssertions();
      if (!golden.ok) {
        return { aborted: true, goldenFailures: golden.failures };
      }
    } else {
      console.warn('tests/golden.js 未加载，跳过黄金断言');
    }

    const verbById = {};
    JVT.VERBS.forEach(function (v) { verbById[v.id] = v; });

    console.log('════ 表1｜同类对照组（相邻排列，肉眼对比用） ════');
    const contrastRows = [];
    for (const g of CONTRAST_GROUPS) {
      for (const id of g.ids) {
        const v = verbById[id];
        contrastRows.push({
          对照组: g.group,
          动词: v.kanji + '（' + v.kana + '）',
          类型: v.type,
          ます形: formCell(v, 'masu'),
          て形: formCell(v, 'te'),
          た形: formCell(v, 'ta'),
          ない形: formCell(v, 'nai'),
          たい形: formCell(v, 'tai'),
        });
      }
    }
    console.table(contrastRows);

    console.log('════ 表2｜全部动词 × 全部形态（⚠ = traps 非空，重点核对） ════');
    const allRows = JVT.VERBS.map(function (v) {
      return {
        动词: (v.traps.length ? '⚠ ' : '') + v.kanji,
        假名: v.kana,
        释义: v.meaning,
        类型: v.type,
        等级: v.level,
        陷阱: v.traps.join(','),
        ます形: formCell(v, 'masu'),
        て形: formCell(v, 'te'),
        た形: formCell(v, 'ta'),
        ない形: formCell(v, 'nai'),
        たい形: formCell(v, 'tai'),
      };
    });
    console.table(allRows);

    console.log('════ 表3｜假名形与汉字形不同步检查表（读音变化，重点核对） ════');
    let syncRows = [];
    JVT.VERBS.forEach(function (v) { syncRows = syncRows.concat(kanaSyncIssues(v)); });
    if (syncRows.length) {
      console.table(syncRows);
    } else {
      console.log('（无：所有动词的假名形都可由汉字形词干直接替换得到）');
    }

    console.log('════ 数据一致性检查 ════');
    const dangling = [];
    const teCoverage = {};
    for (const v of JVT.VERBS) {
      for (const form of CONJUGATED_FORMS) {
        const r = conjugate(v, form);
        if (r.ruleId && !RULE_BY_ID[r.ruleId]) dangling.push(v.id + ':' + form + ' → ' + r.ruleId);
        if (form === 'te') teCoverage[r.ruleId] = (teCoverage[r.ruleId] || 0) + 1;
      }
    }
    for (const lesson of JVT.LESSONS) {
      for (const rid of lesson.ruleIds) {
        if (!RULE_BY_ID[rid]) dangling.push('lesson ' + lesson.id + ' → ' + rid);
      }
    }
    console.log('动词总数: ' + JVT.VERBS.length + '，共 ' + JVT.VERBS.length * CONJUGATED_FORMS.length + ' 条活用');
    console.log('て形规则覆盖数:', teCoverage);
    if (dangling.length) {
      console.error('悬空 ruleId（必须为 0）:', dangling);
    } else {
      console.log('悬空 ruleId: 无 ✓');
    }

    return { verbs: JVT.VERBS.length, syncIssues: syncRows.length, dangling: dangling.length };
  }

  JVT.FORMS = FORMS;
  JVT.conjugate = conjugate;
  JVT.selfTest = selfTest;
})();
