CREATE SEQUENCE text_overlay_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE text_overlay_id_seq
  OWNER TO postgres;
  
CREATE TABLE public.text_overlay
(
  id integer NOT NULL DEFAULT nextval('text_overlay_id_seq'::regclass),
  media_id integer,
  content text,
  text_position character varying(255),
  time_range character varying(20),
  CONSTRAINT text_overlay_pkey PRIMARY KEY (id),
  FOREIGN KEY (media_id) REFERENCES "media_file" (id) ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE text_overlay
  OWNER TO postgres;
