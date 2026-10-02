import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { availableTemplateIds, coreTemplateIds } from '../tools/templates.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');

test('documentation catalogue stays in lockstep with the selectable registry', () => {
  const data = JSON.parse(read('docs/src/data/templates.json'));
  const registry = availableTemplateIds();
  const docs = data.templates.map((t) => t.id);

  assert.equal(data.meta.count, registry.length);
  assert.deepEqual(docs, registry);
  assert.equal(coreTemplateIds().length, 17, 'the frozen upstream core set remains seventeen');
  assert.equal(registry.length - coreTemplateIds().length, 13, 'GoldApp custom tier remains thirteen');
});

test('package version matches the release VERSION file', () => {
  const version = read('VERSION').trim();
  const pkg = JSON.parse(read('package.json'));

  assert.equal(pkg.version, version);
  assert.match(version, /^\d+\.\d+\.\d+$/, 'stable release version must be plain SemVer');
});
