# 動詞活用トレーナー

JLPT N5 日语动词活用规则训练器。个人备考工具，单用户。

- 产品规格与架构：[docs/SPEC.md](docs/SPEC.md)
- 开发约束：[CLAUDE.md](CLAUDE.md)

当前可用功能：

- 动词分类训练：覆盖 59 个 N5 核心词，并额外保留常见陷阱动词。
- て形输出训练：覆盖 9 条具体规则和「行く」特例，错误时展示完整变形链。
- ます形、ない形、た形、たい形：59 个 N5 核心动词全量输出训练。
- 综合训练中心：混合全部题型，按最新作答状态强化错题并推荐薄弱规则。
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
