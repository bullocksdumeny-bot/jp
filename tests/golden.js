// tests/golden.js — 黄金断言
//
// 12 个代表性动词的期望活用值（覆盖全部陷阱类别与不规则变形），人工核对后硬编码。
// JVT.selfTest() 启动时先跑这里的断言，任何一条不匹配就红色大字报错并停止后续输出。
// field 指定比对 kanji 还是 kana 字段：来る 的考点在读音，按假名核对；其余按汉字形。
// 每条同时校验 ruleId，防止「结果碰巧对但走错了规则」。

(function () {
  'use strict';

  const JVT = window.JVT = window.JVT || {};

  JVT.GOLDEN = [
    {
      id: 'kaeru-return', field: 'kanji',
      forms: {
        masu: ['帰ります', 'masu-godan'],
        te: ['帰って', 'te-utsuru'],
        ta: ['帰った', 'ta-utsuru'],
        nai: ['帰らない', 'nai-godan'],
      },
    },
    {
      id: 'kariru', field: 'kanji',
      forms: {
        masu: ['借ります', 'masu-ichidan'],
        te: ['借りて', 'te-ichidan'],
        ta: ['借りた', 'ta-ichidan'],
        nai: ['借りない', 'nai-ichidan'],
      },
    },
    {
      id: 'iku', field: 'kanji',
      forms: {
        masu: ['行きます', 'masu-godan'],
        te: ['行って', 'te-iku'],
        ta: ['行った', 'ta-iku'],
        nai: ['行かない', 'nai-godan'],
      },
    },
    {
      id: 'kiru-wear', field: 'kanji',
      forms: {
        masu: ['着ます', 'masu-ichidan'],
        te: ['着て', 'te-ichidan'],
        ta: ['着た', 'ta-ichidan'],
        nai: ['着ない', 'nai-ichidan'],
      },
    },
    {
      id: 'tsuku', field: 'kanji',
      forms: {
        masu: ['着きます', 'masu-godan'],
        te: ['着いて', 'te-ku'],
        ta: ['着いた', 'ta-ku'],
        nai: ['着かない', 'nai-godan'],
      },
    },
    {
      id: 'oyogu', field: 'kanji',
      forms: {
        masu: ['泳ぎます', 'masu-godan'],
        te: ['泳いで', 'te-gu'],
        ta: ['泳いだ', 'ta-gu'],
        nai: ['泳がない', 'nai-godan'],
      },
    },
    {
      id: 'kaku', field: 'kanji',
      forms: {
        masu: ['書きます', 'masu-godan'],
        te: ['書いて', 'te-ku'],
        ta: ['書いた', 'ta-ku'],
        nai: ['書かない', 'nai-godan'],
      },
    },
    {
      id: 'asobu', field: 'kanji',
      forms: {
        masu: ['遊びます', 'masu-godan'],
        te: ['遊んで', 'te-mbn'],
        ta: ['遊んだ', 'ta-mbn'],
        nai: ['遊ばない', 'nai-godan'],
      },
    },
    {
      id: 'kau', field: 'kanji',
      forms: {
        masu: ['買います', 'masu-godan'],
        te: ['買って', 'te-utsuru'],
        ta: ['買った', 'ta-utsuru'],
        nai: ['買わない', 'nai-godan-u'],
      },
    },
    {
      id: 'aru', field: 'kanji',
      forms: {
        masu: ['あります', 'masu-godan'],
        te: ['あって', 'te-utsuru'],
        ta: ['あった', 'ta-utsuru'],
        nai: ['ない', 'nai-aru'],
      },
    },
    {
      id: 'kuru', field: 'kana',
      forms: {
        masu: ['きます', 'masu-kuru'],
        te: ['きて', 'te-kuru'],
        ta: ['きた', 'ta-kuru'],
        nai: ['こない', 'nai-kuru'],
      },
    },
    {
      id: 'benkyou-suru', field: 'kanji',
      forms: {
        masu: ['勉強します', 'masu-suru'],
        te: ['勉強して', 'te-suru'],
        ta: ['勉強した', 'ta-suru'],
        nai: ['勉強しない', 'nai-suru'],
      },
    },
  ];

  JVT.runGoldenAssertions = function () {
    const byId = {};
    JVT.VERBS.forEach(function (v) { byId[v.id] = v; });

    const failures = [];
    let total = 0;
    for (const g of JVT.GOLDEN) {
      const verb = byId[g.id];
      if (!verb) {
        failures.push('动词不存在: ' + g.id);
        continue;
      }
      for (const form of Object.keys(g.forms)) {
        total++;
        const expected = g.forms[form][0];
        const expectedRuleId = g.forms[form][1];
        const r = JVT.conjugate(verb, form);
        const actual = r[g.field];
        if (actual !== expected || r.ruleId !== expectedRuleId) {
          failures.push(
            verb.kanji + ' ' + form + '形: 得到 ' + actual + '（' + r.ruleId + '），期望 ' +
            expected + '（' + expectedRuleId + '）'
          );
        }
      }
    }

    if (failures.length) {
      console.error('%c黄金断言失败 ✗ ' + failures.length + '/' + total + ' 条不匹配，已停止后续输出',
        'color:#b3261e;font-size:24px;font-weight:bold');
      failures.forEach(function (f) {
        console.error('%c' + f, 'color:#b3261e;font-size:14px;font-weight:bold');
      });
    } else {
      console.log('黄金断言: ' + total + '/' + total + ' 通过 ✓');
    }
    return { ok: failures.length === 0, total: total, failures: failures };
  };
})();
