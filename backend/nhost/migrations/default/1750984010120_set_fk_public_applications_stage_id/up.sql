alter table "public"."applications"
  add constraint "applications_stage_id_fkey"
  foreign key ("stage_id")
  references "public"."application_stages"
  ("id") on update restrict on delete cascade;
