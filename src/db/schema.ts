import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/**
 * 数据库只存「会变的东西」：作答流水、掌握度、LLM 生成内容缓存。
 *
 * 规则表和动词库是静态内容，真身在 src/data/*.ts（TypeScript 常量，
 * 有类型检查、可跑单测、进 git 版本管理），不入库。因此这里的
 * ruleId / verbId 都是字符串外键，指向 TS 里的稳定 id，不做数据库级
 * 外键约束——完整性由 TypeScript 保证，避免维护一套永远可能和代码
 * 漂移的 seed 流程。
 *
 * 全站单用户，故没有 user_id。
 */

/** 每一次作答的流水，是掌握度的唯一事实来源，永不删除。 */
export const attempts = pgTable(
  "attempts",
  {
    id: serial("id").primaryKey(),
    /** src/data/rules.ts 里的规则 id，如 te-mu-bu-nu、skill-classify */
    ruleId: text("rule_id").notNull(),
    /** src/data/verbs.ts 里的动词 id，如 yomu。判定题以外可能为空 */
    verbId: text("verb_id"),
    /** classify | drill | produce | mixed | review */
    mode: text("mode").notNull(),
    /** 题面原文，便于日后回看当时问的到底是什么 */
    prompt: text("prompt").notNull(),
    expected: text("expected").notNull(),
    answer: text("answer").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    elapsedMs: integer("elapsed_ms"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("attempts_rule_created_idx").on(t.ruleId, t.createdAt),
    index("attempts_created_idx").on(t.createdAt),
  ],
);

/** 按规则粒度聚合的掌握度。一条规则一行，判定模式同样占一行。 */
export const ruleMastery = pgTable("rule_mastery", {
  ruleId: text("rule_id").primaryKey(),
  attemptCount: integer("attempt_count").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  /** 当前连对数，断一次清零 */
  streak: integer("streak").notNull().default(0),
  /** 0~1，近期表现加权，不是简单正确率 */
  mastery: real("mastery").notNull().default(0),
  /** SRS 间隔（天）与下次到期时间 */
  intervalDays: real("interval_days").notNull().default(0),
  dueAt: timestamp("due_at", { withTimezone: true }),
  lastPracticedAt: timestamp("last_practiced_at", { withTimezone: true }),
});

/**
 * 大模型生成内容的缓存。命中即返回，未命中才调 API。
 * promptVersion / model 参与唯一键，改了 prompt 或换了模型自然重生成，
 * 不需要手动清库。
 */
export const generatedContent = pgTable(
  "generated_content",
  {
    id: serial("id").primaryKey(),
    /** rule_lesson | rule_examples | error_explain */
    kind: text("kind").notNull(),
    /** 同 kind 下的稳定业务键，如规则 id 或 "ruleId:verbId:错误答案" */
    cacheKey: text("cache_key").notNull(),
    promptVersion: integer("prompt_version").notNull(),
    model: text("model").notNull(),
    payload: jsonb("payload").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("generated_content_key_idx").on(
      t.kind,
      t.cacheKey,
      t.promptVersion,
      t.model,
    ),
  ],
);
