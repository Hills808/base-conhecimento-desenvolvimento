import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const load = path => JSON.parse(readFileSync(new URL('../'+path, import.meta.url), 'utf8'));
const lessons = load('src/data/module-lessons.json');
const advanced = load('src/data/advanced-modules.json');
const counts = load('src/data/module-question-counts.json');
let questionCount = 0;
assert.equal(Object.keys(lessons).length, 9, 'All general modules need lessons');
for (let id = 0; id < 9; id++) {
  const stages = lessons[id];
  assert.equal(stages.length, 5, `Module ${id} must have five levels`);
  for (const [level, stage] of stages.entries()) {
    for (const field of ['prerequisite','hours','explanation','example','expected','unblock']) assert.ok(typeof stage[field] === 'string' && stage[field].length > 4, `${id}/${level}: missing ${field}`);
    assert.ok(stage.walkthrough.length >= 3, `${id}/${level}: insufficient guided steps`);
    assert.ok(stage.challenge.length >= 2, `${id}/${level}: missing individual variation`);
    assert.ok(stage.materials.length > 0, `${id}/${level}: missing material`);
    for (const material of stage.materials) {
      assert.equal(new URL(material.url).protocol, 'https:');
      for (const field of ['focus','language','time','certificate']) assert.ok(material[field], `${id}/${level}: missing material ${field}`);
    }
    assert.equal(stage.questions.length, counts[id][level], 'Progress metadata out of sync');
    for (const question of stage.questions) {
      assert.equal(question.options.length, 3);
      assert.equal(new Set(question.options).size, 3, 'Duplicate answer');
      assert.equal(question.feedback.length, 3);
      assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 3, 'Invalid answer index');
      assert.ok(question.feedback.every(text => typeof text === 'string' && text.length > 15), 'Feedback must explain each answer');
      assert.ok(question.apply && question.review);
      questionCount++;
    }
    if (level >= 3) for (const field of ['name','learn','practice','proof','situation','outcome','attention','checks']) assert.deepEqual(stage[field], advanced[id][level - 3][field], `${id}/${level}: milestone drift in ${field}`);
    assert.ok(readFileSync(new URL(`../public/kits/trilha-${id}.md`, import.meta.url),'utf8').includes(`## Nível ${level}`), 'Offline guide missing level');
  }
}
const lab = load('src/data/laboratory.json');
assert.equal(lab.phases.length,5,'Laboratory must expose final project separately');
assert.equal(new Set(lab.steps.map(s=>s.id)).size,lab.steps.length,'Duplicate lab step');
assert.equal(lab.steps.at(-1).phase,4);
assert.ok(lab.steps.every(s => s.phase >= 0 && s.phase < lab.phases.length));
console.log(`Currículo válido: 45 níveis, ${questionCount} situações explicadas, 9 guias offline e laboratório em 5 níveis.`);
