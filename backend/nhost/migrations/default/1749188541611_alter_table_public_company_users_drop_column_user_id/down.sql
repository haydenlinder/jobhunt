alter table "public"."company_users" alter column "user_id" drop not null;
alter table "public"."company_users" add column "user_id" text;
