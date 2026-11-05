// Each object is committed in a single D1 batch. The random generation prevents
// a losing concurrent writer from attaching chunks to the winner's object.
const CHUNK_SIZE = 256 * 1024;

export function attachmentStore(db) {
  return {
    async head(key) {
      const row = await db.prepare('SELECT name, size FROM attachment_files WHERE object_key = ?').bind(key).first();
      return row && { size: row.size, customMetadata: { name: row.name } };
    },
    async get(key) {
      const [meta, chunks] = await db.batch([
        db.prepare('SELECT name, size FROM attachment_files WHERE object_key = ?').bind(key),
        db.prepare('SELECT data FROM attachment_chunks WHERE object_key = ? ORDER BY part').bind(key),
      ]);
      const row = meta.results[0];
      if (!row) return null;
      const parts = chunks.results.map(chunk => new Uint8Array(chunk.data));
      if (parts.reduce((sum, part) => sum + part.byteLength, 0) !== row.size) throw new Error('incomplete object');
      return { body: new Blob(parts).stream(), size: row.size, customMetadata: { name: row.name } };
    },
    async put(key, bytes, options) {
      const generation = crypto.randomUUID();
      const statements = [db.prepare('INSERT OR IGNORE INTO attachment_files (object_key, generation, name, size) VALUES (?, ?, ?, ?)').bind(key, generation, options.customMetadata.name, bytes.byteLength)];
      for (let offset = 0, part = 0; offset < bytes.length; offset += CHUNK_SIZE, part++) {
        statements.push(db.prepare('INSERT INTO attachment_chunks (object_key, generation, part, data) SELECT ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM attachment_files WHERE object_key = ? AND generation = ?)').bind(key, generation, part, bytes.slice(offset, offset + CHUNK_SIZE), key, generation));
      }
      const result = await db.batch(statements);
      return result[0].meta.changes === 1 ? { key } : null;
    },
    async delete(key) {
      await db.batch([
        db.prepare('DELETE FROM attachment_chunks WHERE object_key = ?').bind(key),
        db.prepare('DELETE FROM attachment_files WHERE object_key = ?').bind(key),
      ]);
    },
  };
}
