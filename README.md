# 動詞活用トレーナー

JLPT N5 日语动词活用规则训练器。个人备考工具，单用户。

- 产品规格与架构：[docs/SPEC.md](docs/SPEC.md)
- 开发约束：[CLAUDE.md](CLAUDE.md)

当前可用功能：

- 动词分类训练：覆盖 61 个 N5 核心词，并额外保留常见陷阱动词。
- て形输出训练：覆盖 9 条具体规则和「行く」特例，错误时展示完整变形链。
- ます形、ない形、た形、たい形：61 个 N5 核心动词全量输出训练。
- 综合训练中心：混合全部题型，按最新作答状态强化错题并推荐薄弱规则。
- 每日学习诊断：汇总今日与最近七天表现，生成共性错因、突破计划和针对训练。
- 作答记录和按规则拆分的掌握度保存到 Neon。

## 本地跑起来

```bash
npm install
```

复制 `.env.example` 为 `.env.local`，然后填写 `DATABASE_URL`。连接串可在
[neon.tech](https://neon.tech) 项目中复制，使用 pooled connection string。

建表并启动：

```bash
npm run db:migrate
npm run dev
```

打开 http://localhost:3000 即可进入首页，首页有链路自检面板。

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发服务器 |
| `npm run typecheck` | TypeScript 检查 |
| `npm run lint` | ESLint |
| `npm run build` | 生产构建 |
| `npm run db:generate` | 改完 `src/db/schema.ts` 后生成迁移 SQL |
| `npm run db:migrate` | 应用迁移 |
| `npm run db:studio` | 浏览器里看库 |

## 部署

Vercel。需要在项目设置里配置 `DATABASE_URL`，以及内容生成模块使用的
`DEEPSEEK_API_KEY`。

综合训练页的薄弱规则卡片可按需生成复习提示。DeepSeek 只生成记忆与复习文案，
活用答案、规则匹配和判题始终由本地确定性引擎完成；生成结果会写入
`generated_content`，相同规则再次访问不会重复调用模型。

每日诊断按北京时间日期缓存，一天最多生成一次。薄弱规则排序和针对训练题目由
本地统计与规则引擎决定，DeepSeek 不参与答案生成或判题。
