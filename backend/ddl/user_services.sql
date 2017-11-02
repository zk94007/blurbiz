CREATE TABLE user_services
(
  user_id integer NOT NULL,
  facebook boolean,
  instagram boolean,
  dropbox boolean,
  google_drive boolean,
  box boolean,
  twitter boolean,
  CONSTRAINT user_id_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_id_fk FOREIGN KEY (user_id)
      REFERENCES "user" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE user_services
  OWNER TO postgres;