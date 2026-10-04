import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const links = new Set();
function walk(value) {
  if (typeof value === 'string' && /^https?:\/\//.test(value)) links.add(value);
  else if (Array.isArray(value)) value.forEach(walk);
  else if (value && typeof value === 'object') Object.values(value).forEach(walk);
}
for (const file of ['resources.json', 'laboratory.json', 'module-lessons.json']) walk(JSON.parse(fs.readFileSync(path.join(root, 'src/data', file), 'utf8')));
fs.writeFileSync(path.join(root, 'catalog-links.txt'), [...links].sort().join('\n') + '\n');
console.log(`${links.size} links extraídos dos dados para verificação de disponibilidade; isso não verifica gratuidade, idioma ou certificado.`);
