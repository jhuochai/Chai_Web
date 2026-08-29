export const RIBBON_SPOTS = {
  gamesofa: { left: '34.3%', top: '47.7%', anchor: 'crown-left' },
  ntpu: { left: '65.9%', top: '54.1%', anchor: 'crown-right' },
  actg: { left: '38.9%', top: '61.8%', anchor: 'lower-left' },
  eelin: { left: '59.6%', top: '63.6%', anchor: 'lower-right' },
};

export const GAME_BLOOM_LAYOUT = {
  lol: { left: '54%', top: '34.4%', mobileLeft: '62%', mobileTop: '31%', size: 'lg', branch: 'crown-right', rotation: '13deg' },
  r6: { left: '62%', top: '39%', mobileLeft: '82%', mobileTop: '39%', size: 'md', branch: 'crown-right', rotation: '-10deg' },
  'identity-v': { left: '39.5%', top: '43.5%', mobileLeft: '27%', mobileTop: '44%', size: 'md', branch: 'crown-left', rotation: '9deg' },
  gta5: { left: '50.2%', top: '42.2%', mobileLeft: '52%', mobileTop: '40%', size: 'sm', branch: 'crown-center', rotation: '11deg' },
  minecraft: { left: '57.4%', top: '45.7%', mobileLeft: '68%', mobileTop: '49%', size: 'md', branch: 'crown-right', rotation: '-8deg' },
  'wild-rift': { left: '37%', top: '53.6%', mobileLeft: '20%', mobileTop: '59%', size: 'lg', branch: 'lower-left', rotation: '-12deg' },
  'ready-or-not': { left: '63.4%', top: '51%', mobileLeft: '82%', mobileTop: '58%', size: 'sm', branch: 'lower-right', rotation: '-4deg' },
};

// Ellipses are expressed in the original 1672 × 941 scene coordinate system.
// They reveal only the existing branch pixels that need to sit in front of a
// ribbon knot or the lower seam of a bloom.
export const DAY_OCCLUSION_PATCHES = [
  { id: 'gamesofa', cx: 574, cy: 397, rx: 28, ry: 10, rotation: -18 },
  { id: 'ntpu', cx: 1102, cy: 457, rx: 30, ry: 11, rotation: 15 },
  { id: 'actg', cx: 650, cy: 529, rx: 27, ry: 10, rotation: 24 },
  { id: 'eelin', cx: 996, cy: 546, rx: 28, ry: 10, rotation: -20 },
];

export const NIGHT_OCCLUSION_PATCHES = [
  { id: 'lol', cx: 903, cy: 338, rx: 14, ry: 6, rotation: 18 },
  { id: 'r6', cx: 1037, cy: 381, rx: 12, ry: 5, rotation: 26 },
  { id: 'identity-v', cx: 660, cy: 423, rx: 12, ry: 5, rotation: 24 },
  { id: 'gta5', cx: 839, cy: 409, rx: 10, ry: 4, rotation: -14 },
  { id: 'minecraft', cx: 960, cy: 444, rx: 12, ry: 5, rotation: -18 },
  { id: 'wild-rift', cx: 619, cy: 518, rx: 14, ry: 6, rotation: 20 },
  { id: 'ready-or-not', cx: 1060, cy: 492, rx: 10, ry: 4, rotation: -22 },
];
