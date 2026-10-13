CREATE TABLE likes (
  id serial PRIMARY KEY,
  post_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
