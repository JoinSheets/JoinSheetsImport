'use strict';

// Unit tests for the pure functions in import.js (form serialization/parsing, no DOM).
// Run with: node --test.

const test = require('node:test');
const assert = require('node:assert/strict');
const Import = require('../import.js');

// --- wrapSourceJs ------------------------------------------------------------

test('wrapSourceJs: rows -> columns, with undefined (no value) and null (explicitly empty)', () => {
  const payload = {
    meta: { name: 'Excel1', key: 'id', labels: ['a', 'b'], rows: 2 },
    data: [
      { id: '1', a: 'x' },            // b absent -- there was no value
      { id: '2', a: 'y', b: null }    // b explicitly null
    ]
  };
  const js = Import.wrapSourceJs('Excel1', payload);
  assert.match(js, /window\.DS\.sources\["Excel1"\] = \{/);
  assert.ok(js.includes('"id": function () { return ["1", "2"]; }'));
  assert.ok(js.includes('"a": function () { return ["x", "y"]; }'));
  assert.ok(js.includes('"b": function () { return [undefined, null]; }'));
});

test('wrapSourceJs: no key in meta -- columns built from labels only', () => {
  const payload = { meta: { name: 'X', labels: ['a'], rows: 1 }, data: [{ a: '1' }] };
  const js = Import.wrapSourceJs('X', payload);
  assert.ok(js.includes('"a": function () { return ["1"]; }'));
  assert.ok(!js.includes('"undefined": function'));
});

// --- buildManifestFragmentJs / buildImportsIndexJs ---------------------------

test('buildManifestFragmentJs: a single source in sources', () => {
  const js = Import.buildManifestFragmentJs({ name: 'Excel1', file: 'Excel1.js', key: 'id' });
  assert.match(js, /window\.DS_MANIFEST_FRAGMENT = /);
  const sandbox = {};
  new Function('window', js)(sandbox);
  assert.deepEqual(sandbox.DS_MANIFEST_FRAGMENT.sources.map((s) => s.name), ['Excel1']);
});

test('buildImportsIndexJs + parsePriorImportsIndex -- round trip', () => {
  const js = Import.buildImportsIndexJs(['manifest-A.js', 'manifest-B.js']);
  assert.deepEqual(Import.parsePriorImportsIndex(js), ['manifest-A.js', 'manifest-B.js']);
});

// --- parsePriorImportsIndex: does not throw on garbage/missing input -------

test('parsePriorImportsIndex: empty/null -> empty list', () => {
  assert.deepEqual(Import.parsePriorImportsIndex(null), []);
  assert.deepEqual(Import.parsePriorImportsIndex(''), []);
});

test('parsePriorImportsIndex: broken/wrong file -> empty list, not an exception', () => {
  assert.deepEqual(Import.parsePriorImportsIndex('this is not js at all {{{'), []);
  assert.deepEqual(Import.parsePriorImportsIndex('window.DS_MANIFEST = {};'), []);
});

// --- mergeImportsIndex --------------------------------------------------------

test('mergeImportsIndex: adds a new name', () => {
  assert.deepEqual(Import.mergeImportsIndex(['manifest-A.js'], 'manifest-B.js'),
    ['manifest-A.js', 'manifest-B.js']);
});

test('mergeImportsIndex: re-importing the same source does not duplicate the file name', () => {
  assert.deepEqual(Import.mergeImportsIndex(['manifest-A.js'], 'manifest-A.js'), ['manifest-A.js']);
});

test('mergeImportsIndex: empty/missing prior -- a list with one name', () => {
  assert.deepEqual(Import.mergeImportsIndex(null, 'manifest-A.js'), ['manifest-A.js']);
});

// --- tableFromSheetRows --------------------------------------------------------

test('tableFromSheetRows: first row is headers, values are strings', () => {
  const aoa = [['id', 'name'], [1, 'Alice'], [2, 'Bob']];
  const t = Import.tableFromSheetRows(aoa);
  assert.deepEqual(t.headers, ['id', 'name']);
  assert.deepEqual(t.rows, [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }]);
});

test('tableFromSheetRows: a short row -- the missing field is absent from the object (not "")', () => {
  const aoa = [['id', 'name', 'phone'], [1, 'Alice']];
  const t = Import.tableFromSheetRows(aoa);
  assert.deepEqual(t.rows, [{ id: '1', name: 'Alice' }]);
  assert.ok(!('phone' in t.rows[0]));
});

test('tableFromSheetRows: an empty cell ("") is also absent, not an empty string', () => {
  const aoa = [['id', 'name'], [1, '']];
  const t = Import.tableFromSheetRows(aoa);
  assert.deepEqual(t.rows, [{ id: '1' }]);
});

test('tableFromSheetRows: a fully empty sheet row is skipped', () => {
  const aoa = [['id', 'name'], [], [1, 'Alice']];
  const t = Import.tableFromSheetRows(aoa);
  assert.equal(t.rows.length, 1);
});

test('tableFromSheetRows: an empty sheet (no headers) -- empty headers', () => {
  const t = Import.tableFromSheetRows([]);
  assert.deepEqual(t.headers, []);
  assert.deepEqual(t.rows, []);
});
