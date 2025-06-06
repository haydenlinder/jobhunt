alter table "public"."company_users"
  add constraint "company_users_company_id_fkey"
  foreign key ("company_id")
  references "public"."companies"
  ("id") on update restrict on delete restrict;
