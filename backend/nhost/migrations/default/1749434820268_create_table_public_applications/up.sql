CREATE TABLE "public"."applications" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "resume_url" text NOT NULL, "job_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON UPDATE restrict ON DELETE cascade, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
