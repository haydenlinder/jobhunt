alter table "public"."application_stages"
  add constraint "application_stages_job_id_fkey"
  foreign key ("job_id")
  references "public"."jobs"
  ("id") on update restrict on delete cascade;
