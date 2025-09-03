CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO items (name) VALUES
  ('Primero'),
  ('Segundo'),
  ('Tercero')
ON CONFLICT DO NOTHING;