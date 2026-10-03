// Original lightweight cutout controller. No Rive/Spine runtime or sprite playback.
export type Pose = { x: number; y: number; scale: number; turn: number; head: number; torso: number; left: number; right: number; legs: number };
export type MotionState = "idle" | "tip" | "interacting" | "celebrating" | "dragging";
export const celebrationDuration = 2100;
export const neutral = (): Pose => ({ x: 0, y: 0, scale: 1, turn: 0, head: 0, torso: 0, left: 0, right: 0, legs: 0 });
export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(min, max), Math.max(min, value));
const ease = (t: number) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
const mix = (a: Pose, b: Pose, t: number): Pose => Object.fromEntries(Object.keys(a).map(key => [key, a[key as keyof Pose] + (b[key as keyof Pose] - a[key as keyof Pose]) * t])) as Pose;
const keys: [number, Partial<Pose>][] = [
  [0, {}],
  [260, { y: 1.5, scale: .985, torso: -1, head: 1.5, left: -2, right: 2 }],
  [570, { y: -9, scale: 1.008, turn: -1.2, head: -1.5, torso: 1, left: 6, right: -7, legs: -1 }],
  [850, { y: -4, turn: 1, head: 2, torso: -.5, left: 4, right: -5 }],
  [1100, { y: 1.5, scale: .986, torso: -.8, head: 1, left: 2, right: -2, legs: 1 }],
  [1450, { head: -1, right: -5 }],
  [1750, { head: 1.5, right: -2 }],
  [celebrationDuration, {}]
];
export function celebrationPose(time: number): Pose {
  const t = clamp(time, 0, celebrationDuration);
  const index = keys.findIndex(([at]) => at >= t);
  if (index <= 0) return neutral();
  const [before, a] = keys[index - 1];
  const [after, b] = keys[index];
  return mix({ ...neutral(), ...a }, { ...neutral(), ...b }, ease((t - before) / (after - before)));
}
export function targetPose(state: MotionState, elapsed: number, idleTime: number, look: number): Pose {
  if (state === "celebrating") return celebrationPose(elapsed);
  if (state === "dragging") return neutral();
  const phase = idleTime / 1000;
  const breath = Math.sin(phase * Math.PI / 2.7);
  const pose = { ...neutral(), head: Math.sin(phase * .65) * .8 + look, torso: breath * .35, left: breath * .6, right: -breath * .55 };
  if (state === "tip") { pose.head += .8; pose.right -= 1; }
  if (state === "interacting") {
    const pulse = Math.sin(Math.PI * clamp(elapsed / 1200, 0, 1)) ** 2;
    pose.head += 1.8 * pulse;
    pose.right -= 4 * pulse;
  }
  return pose;
}
// Frame-rate independent damping preserves the current pose when states change.
export function blendPose(current: Pose, target: Pose, deltaMs: number): Pose {
  return mix(current, target, 1 - Math.exp(-clamp(deltaMs, 0, 48) / 70));
}
export function mascotGeometry(viewport: { width: number; height: number }, x: number, offsetY: number) {
  const width = viewport.width <= 720 ? 88 : 100;
  const characterHeight = width * 4 / 3;
  const height = characterHeight + 44;
  const edge = 12;
  const maxX = Math.max(edge, viewport.width - width - edge);
  const maxY = Math.max(edge, viewport.height - height - edge);
  return { width, characterHeight, height, edge, left: edge + clamp(x, 0, 1) * (maxX - edge), bottom: clamp(edge + offsetY, edge, maxY), maxX, maxY };
}
export function bubbleGeometry(viewport: { width: number; height: number }, left: number, bottom: number, width: number) {
  const bubbleWidth = Math.max(160, Math.min(300, viewport.width - 24));
  const maxHeight = Math.max(120, Math.min(380, viewport.height - 24));
  const preferred = left > viewport.width / 2 ? left - bubbleWidth - 8 : left + width + 8;
  return { width: bubbleWidth, maxHeight, left: clamp(preferred, 12, viewport.width - bubbleWidth - 12), bottom: clamp(bottom + 54, 12, viewport.height - maxHeight - 12) };
}
