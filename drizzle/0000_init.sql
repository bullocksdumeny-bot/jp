CREATE TABLE "attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" text NOT NULL,
	"verb_id" text,
	"mode" text NOT NULL,
	"prompt" text NOT NULL,
	"expected" text NOT NULL,
	"answer" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"elapsed_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generated_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"cache_key" text NOT NULL,
	"prompt_version" integer NOT NULL,
	"model" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rule_mastery" (
	"rule_id" text PRIMARY KEY NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"mastery" real DEFAULT 0 NOT NULL,
	"interval_days" real DEFAULT 0 NOT NULL,
	"due_at" timestamp with time zone,
	"last_practiced_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "attempts_rule_created_idx" ON "attempts" USING btree ("rule_id","created_at");--> statement-breakpoint
CREATE INDEX "attempts_created_idx" ON "attempts" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "generated_content_key_idx" ON "generated_content" USING btree ("kind","cache_key","prompt_version","model");