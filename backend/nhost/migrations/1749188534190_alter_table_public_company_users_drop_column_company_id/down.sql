alter table "public"."company_users" alter column "company_id" drop not null;
alter table "public"."company_users" add column "company_id" text;
