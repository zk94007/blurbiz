ALTER TABLE public.team ADD COLUMN integrations_and_connections character varying;
ALTER TABLE public.team ADD COLUMN selected_fb_pages character varying;

ALTER TABLE public.user DROP COLUMN integrations_and_connections;
ALTER TABLE public.user DROP COLUMN selected_fb_pages;