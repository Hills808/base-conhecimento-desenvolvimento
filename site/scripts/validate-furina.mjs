import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/furina-motion.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { celebrationPose, celebrationDuration, neutral, blendPose, mascotGeometry, bubbleGeometry } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
// Continuity and bounded joints prevent the disconnected-limb regression.
let previous = celebrationPose(0);
for (let time = 1; time <= celebrationDuration; time++) {
  const pose = celebrationPose(time);
  for (const key of Object.keys(pose)) {
    assert(Number.isFinite(pose[key]));
    assert(Math.abs(pose[key] - previous[key]) < .12, `discontinuity at ${time}: ${key}`);
  }
  assert(Math.abs(pose.left) <= 7 && Math.abs(pose.right) <= 7);
  assert(Math.abs(pose.head) <= 3 && pose.y >= -9 && pose.scale >= .985);
  previous = pose;
}
assert.deepEqual(celebrationPose(-100), neutral());
assert.deepEqual(celebrationPose(celebrationDuration + 100), neutral());
for (const interval of [8, 16, 33]) {
  let pose = celebrationPose(570);
  for (let elapsed = 0; elapsed < 900; elapsed += interval) pose = blendPose(pose, neutral(), interval);
  assert(Math.abs(pose.y) < .01, 'must settle smoothly at different refresh rates');
}
// Phone portrait, phone landscape, desktop, zoom-equivalent narrow viewport.
let layouts = 0;
for (const [width, height] of [[320,568],[390,844],[844,390],[1280,720],[1920,1080],[280,360]]) {
  for (const x of [-1,0,.25,.5,1,2]) for (const offset of [-200,0,100,3000]) {
    const viewport = {width,height}, rig = mascotGeometry(viewport,x,offset);
    assert(rig.left >= 12 && rig.left + rig.width <= width - 12);
    assert(rig.bottom >= 12 && rig.bottom + rig.height <= height - 12);
    const bubble = bubbleGeometry(viewport,rig.left,rig.bottom,rig.width);
    assert(bubble.left >= 12 && bubble.left + bubble.width <= width - 12);
    assert(bubble.bottom >= 12 && bubble.bottom + bubble.maxHeight <= height - 12);
    layouts++;
  }
}
console.log(`Furina: ${celebrationDuration} amostras de movimento contínuo, retorno em 3 taxas de atualização e ${layouts} posições responsivas válidas.`);
