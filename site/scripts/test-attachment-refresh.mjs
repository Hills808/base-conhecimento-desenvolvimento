import assert from 'node:assert/strict';
import test from 'node:test';
import { watchAttachmentList } from '../src/attachmentRefresh.ts';

function browser() {
  const win = new EventTarget();
  const doc = new EventTarget();
  doc.visibilityState = 'visible';
  let timer;
  win.setInterval = (callback, interval) => { timer = { callback, interval }; return 1; };
  win.clearInterval = () => { timer = undefined; };
  return { win, doc, tick: () => timer?.callback(), interval: () => timer?.interval };
}

test('a lista acompanha arquivos enviados por outro aparelho e para ao fechar', () => {
  const { win, doc, tick, interval } = browser();
  const sharedFiles = [];
  let displayedFiles;
  const stop = watchAttachmentList(() => { displayedFiles = [...sharedFiles]; }, win, doc);
  assert.deepEqual(displayedFiles, []);
  assert.equal(interval(), 20_000);

  sharedFiles.push('exemplo.txt');
  assert.deepEqual(displayedFiles, []);
  tick();
  assert.deepEqual(displayedFiles, ['exemplo.txt']);

  sharedFiles.length = 0;
  doc.visibilityState = 'hidden';
  tick();
  assert.deepEqual(displayedFiles, ['exemplo.txt']);
  doc.visibilityState = 'visible';
  doc.dispatchEvent(new Event('visibilitychange'));
  assert.deepEqual(displayedFiles, []);

  sharedFiles.push('outro.txt');
  win.dispatchEvent(new Event('focus'));
  assert.deepEqual(displayedFiles, ['outro.txt']);
  stop();
  sharedFiles.push('nao-deve-atualizar.txt');
  tick();
  win.dispatchEvent(new Event('focus'));
  doc.dispatchEvent(new Event('visibilitychange'));
  assert.deepEqual(displayedFiles, ['outro.txt']);
});
