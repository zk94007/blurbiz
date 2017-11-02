ALTER TABLE public.text_overlay DROP COLUMN text_position;

ALTER TABLE public.text_overlay ADD COLUMN o_width integer;
ALTER TABLE public.text_overlay ADD COLUMN o_height integer;
ALTER TABLE public.text_overlay ADD COLUMN o_left integer;
ALTER TABLE public.text_overlay ADD COLUMN o_top integer;
ALTER TABLE public.text_overlay ADD COLUMN o_degree numeric NOT NULL DEFAULT 0;