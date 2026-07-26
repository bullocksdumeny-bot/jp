# Japanese Verb Trainer — 项目约束

本文件是最高优先级约束。每次改动前先读 `docs/PRODUCT.md`（产品定位）和 `docs/SPEC.md`（算法规格）。
本文件与它们冲突时，以本文件为准。

## 产品一句话

让 JLPT N5~N3 动词活用的形式变换达到**考场级自动化**（3~5 秒内零思考完成），
从而在考试中释放认知资源用于读解与文法。

**明确不在范围内**：单词记忆、语法功能教学（何时用て形）、口语、作文、AI 对话。
遇到这些需求一律拒绝并说明超出范围。

## 使用者

单人使用。中文母语，软件工程本科生，当前 N5，目标 N2。
UI 文案用简体中文，例词与活用形用日语。不需要多语言、不需要多用户。

## 架构铁律

1. **四层数据结构**：课程(Course) → 知识点(Lesson) → 规则(Rule) → 动词(Verb)。
   任何新功能都必须挂在这四层上，不得引入平行结构。

2. **活用形一律由 `conjugate(verb, form)` 引擎按规则推导，禁止手写答案表。**
   不规则动词通过 verb 数据里的 `overrides` 字段处理，不得在引擎里写 if-else 特判。
   新增动词只应改数据文件，不应改引擎。

3. **掌握度按「规则」粒度统计，不按知识点、不按单词。**
   `て形 64%` 是由 `く→いて 90% / ぐ→いで 40% / む・ぶ・ぬ→78%` 聚合出来的，
   不是独立存储的数字。

4. **答错必须输出完整推理链，禁止只显示正确答案。**
   链条格式见 `docs/SPEC.md` 的 `chain` 定义。

5. **存储层必须隔离在 `src/store.js` 后面。**
   Phase 1 用 localStorage，Phase 3 换 Spring Boot API 时只改这一个文件。
   业务代码不得直接调用 localStorage。

## Phase 1 技术约束

- 单页应用，**零构建、零依赖**。双击 index.html 即可运行。
- **禁止使用 ES module 语法（import/export），一律用经典 script + JVT 全局命名空间。**
  理由：file:// 双击可用是产品刚需，Chrome 在 file:// 下拦截 ES module，
  不能让「先起服务器」成为使用门槛。加载顺序：rules → verbs → engine →（tests/golden）→ 业务脚本。
- 不引入 React/Vue/打包器/CSS 框架/CDN 资源。离线必须可用。
- 文件拆分：`index.html` / `src/engine.js` / `src/srs.js` / `src/store.js` / `src/ui.js` / `data/rules.js` / `data/verbs.js`
- 所有数据文件必须是纯数据，不含逻辑。

## 设计方向

不要生成通用后台管理风格或渐变卡片风格。视觉锚点取自日语学习本身的实物：
原稿用紙的浅绿格线、朱笔批改的红、明朝体的日语大字。

- 日语显示字体优先明朝体系统栈：`"Hiragino Mincho ProN","Yu Mincho","Songti SC",serif`
- 中文 UI 用 `"PingFang SC","Microsoft YaHei",system-ui`
- 数字与百分比用等宽体
- 签名元素：**五十音段位尺**。讲解五段动词时，竖排显示该行的 あ/い/う/え/お 五个假名，
  标注每一段对应哪个活用形（あ段→ない形，い段→ます形，う段→辞書形），高亮当前变形落点。
  这是整个 App 的核心心智模型，必须做好。
- 克制：只在段位尺上花视觉预算，其余保持安静。
- 质量底线：手机可用、键盘可操作（数字键选项、Enter 提交）、尊重 `prefers-reduced-motion`。

## 工作方式

- 改动前先说明方案，等我确认再写代码。不要一次性生成整个应用。
- 每个 Phase 结束时提交一次 git commit，commit message 用中文描述功能。
- 不要写测试框架配置，但引擎函数（conjugate / srs）要有可直接在控制台跑的自检用例。
- 不要生成 README 之外的文档，不要生成 CI 配置。
