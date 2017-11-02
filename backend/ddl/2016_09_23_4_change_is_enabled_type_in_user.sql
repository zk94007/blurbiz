alter table public.user drop column is_enabled;
alter table public.user add column is_enabled integer default 1;