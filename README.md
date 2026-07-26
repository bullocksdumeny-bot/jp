# 動詞活用トレーナー

JLPT N5 日语动词活用规则训练器。个人备考工具，单用户。

- 产品规格与架构：[docs/SPEC.md](docs/SPEC.md)
- 开发约束：[CLAUDE.md](CLAUDE.md)

## 本地跑起来

```bash
npm install
```

复制 `.env.example` 为 `.env.local`，然后填三个值：

```bash
npm run gen-secret                    # 输出 SESSION_SECRET
npm run hash-password -- "你的密码"   # 输出 APP_PASSWORD_HASH
```

`DATABASE_URL` 去 [neon.tech](https://neon.tech) 建个免费项目，复制 pooled connection string。

建表并启动：

```bash
npm run db:migrate
npm run dev
```

打开 http://localhost:3000 会跳到登录页，输密码进入。首页有链路自检面板。

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

Vercel。需要在项目设置里配的环境变量：`DATABASE_URL`、`APP_PASSWORD_HASH`、`SESSION_SECRET`，
以及 Phase 6 才用得上的 `ANTHROPIC_API_KEY`。
