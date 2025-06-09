alter table "public"."applications"
  add constraint "applications_company_id_fkey"
  foreign key ("company_id")
  references "public"."companies"
  ("id") on update restrict on delete restrict;
