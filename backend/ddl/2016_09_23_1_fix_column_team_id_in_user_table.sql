ALTER TABLE "user" DROP COLUMN team_id;
ALTER TABLE "user" ADD COLUMN team_id integer;

ALTER TABLE "user"
  ADD CONSTRAINT user_team_id_fkey FOREIGN KEY (team_id)
      REFERENCES team (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;