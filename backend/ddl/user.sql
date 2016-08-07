CREATE SEQUENCE user_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 14
  CACHE 1;
ALTER TABLE user_id_seq
  OWNER TO postgres;

CREATE TABLE public."user"
(
   id integer NOT NULL DEFAULT nextval('user_id_seq'), 
   login character varying(255), 
   password character varying(255), 
   name character varying(255), 
   company character varying(255), 
   email character varying(255), 
   is_confirmed boolean DEFAULT false,
   last_login_date timestamp without time zone, 
   CONSTRAINT user_pkey PRIMARY KEY (id),
  
   CONSTRAINT user_login_key UNIQUE (login)
) 
WITH (
  OIDS = FALSE
)
;
ALTER TABLE public."user"
  OWNER TO postgres;
