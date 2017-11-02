alter table public.project alter column created_at type timestamp with time zone;

alter table public.task alter column scheduled_start_date type timestamp with time zone;
alter table public.task alter column start_date type timestamp with time zone;

alter table public.user alter column last_login_date type timestamp with time zone;