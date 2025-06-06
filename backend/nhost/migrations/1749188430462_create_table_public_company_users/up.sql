CREATE TABLE "public"."company_users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" text NOT NULL, "company_id" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
