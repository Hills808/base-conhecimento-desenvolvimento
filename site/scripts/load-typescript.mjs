import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
const externalRequire = createRequire(import.meta.url);
const cache = new Map();
// Executes only repository modules, with normal relative dependency resolution.
export function loadTypeScript(file) {
  if (cache.has(file)) return cache.get(file).exports;
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const module = { exports: {} }; cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8').replaceAll('import.meta.env.BASE_URL', JSON.stringify('/base-conhecimento-desenvolvimento/')), { fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const require = spec => { if (spec.endsWith('.css')) return {}; if (!spec.startsWith('.')) return externalRequire(spec); const target = path.resolve(path.dirname(file), spec); return loadTypeScript(fs.existsSync(target) ? target : fs.existsSync(`${target}.ts`) ? `${target}.ts` : `${target}.tsx`); };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(require, module, module.exports);
  return module.exports;
}
