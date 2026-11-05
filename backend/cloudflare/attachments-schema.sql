CREATE TABLE attachment_files (
  object_key TEXT PRIMARY KEY,
  generation TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  size INTEGER NOT NULL CHECK (size > 0 AND size <= 5242880)
) STRICT;
CREATE TABLE attachment_chunks (
  object_key TEXT NOT NULL,
  generation TEXT NOT NULL,
  part INTEGER NOT NULL CHECK (part >= 0),
  data BLOB NOT NULL,
  PRIMARY KEY (object_key, part),
  FOREIGN KEY (generation) REFERENCES attachment_files(generation) ON DELETE CASCADE
) STRICT;
