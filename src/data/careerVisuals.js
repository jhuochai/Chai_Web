import ribbonGamesofa from '../assets/scenes/ribbons/ribbon-gamesofa-v1.webp';
import ribbonNtpu from '../assets/scenes/ribbons/ribbon-ntpu-v1.webp';
import ribbonActg from '../assets/scenes/ribbons/ribbon-actg-v1.webp';
import ribbonEelin from '../assets/scenes/ribbons/ribbon-eelin-v1.webp';
import bloomWildRift from '../assets/scenes/blooms/bloom-wild-rift-v1.webp';
import bloomIdentityV from '../assets/scenes/blooms/bloom-identity-v-v1.webp';
import bloomStardew from '../assets/scenes/blooms/bloom-stardew-v1.webp';
import bloomLol from '../assets/scenes/blooms/bloom-lol-v1.webp';
import bloomValorant from '../assets/scenes/blooms/bloom-valorant-v1.webp';
import bloomR6 from '../assets/scenes/blooms/bloom-r6-v1.webp';
import bloomGta5 from '../assets/scenes/blooms/bloom-gta5-v1.webp';
import bloomMinecraft from '../assets/scenes/blooms/bloom-minecraft-v1.webp';
import bloomPalworld from '../assets/scenes/blooms/bloom-palworld-v1.webp';
import bloomDontStarve from '../assets/scenes/blooms/bloom-dont-starve-v1.webp';
import bloomRaft from '../assets/scenes/blooms/bloom-raft-v1.webp';
import bloomReadyOrNot from '../assets/scenes/blooms/bloom-ready-or-not-v1.webp';

export const CAREER_RIBBON_VISUALS = {
  gamesofa: { asset: ribbonGamesofa, accent: '#45c7db', glow: 'rgba(69, 199, 219, 0.34)' },
  ntpu: { asset: ribbonNtpu, accent: '#d8c9a2', glow: 'rgba(216, 201, 162, 0.28)' },
  actg: { asset: ribbonActg, accent: '#75c7ad', glow: 'rgba(117, 199, 173, 0.3)' },
  eelin: { asset: ribbonEelin, accent: '#c48ba6', glow: 'rgba(196, 139, 166, 0.3)' },
};

export const GAME_BLOOM_VISUALS = {
  'wild-rift': { asset: bloomWildRift, accent: '#51c6ba', glow: 'rgba(81, 198, 186, 0.32)' },
  'identity-v': { asset: bloomIdentityV, accent: '#8f3f4a', glow: 'rgba(143, 63, 74, 0.34)' },
  stardew: { asset: bloomStardew, accent: '#b7c766', glow: 'rgba(183, 199, 102, 0.3)' },
  lol: { asset: bloomLol, accent: '#c7a65e', glow: 'rgba(199, 166, 94, 0.3)' },
  valorant: { asset: bloomValorant, accent: '#df4c47', glow: 'rgba(223, 76, 71, 0.34)' },
  r6: { asset: bloomR6, accent: '#d59b3c', glow: 'rgba(213, 155, 60, 0.32)' },
  gta5: { asset: bloomGta5, accent: '#b56bb6', glow: 'rgba(181, 107, 182, 0.3)' },
  minecraft: { asset: bloomMinecraft, accent: '#6d9f4d', glow: 'rgba(109, 159, 77, 0.34)' },
  palworld: { asset: bloomPalworld, accent: '#64c7cf', glow: 'rgba(100, 199, 207, 0.32)' },
  'dont-starve': { asset: bloomDontStarve, accent: '#c8bca7', glow: 'rgba(200, 188, 167, 0.28)' },
  raft: { asset: bloomRaft, accent: '#4faeba', glow: 'rgba(79, 174, 186, 0.32)' },
  'ready-or-not': { asset: bloomReadyOrNot, accent: '#d94141', glow: 'rgba(217, 65, 65, 0.36)' },
};

export function getCareerVisual(kind, id) {
  const collection = kind === 'ribbon' ? CAREER_RIBBON_VISUALS : GAME_BLOOM_VISUALS;
  const visual = collection[id];
  if (!visual) throw new Error(`Missing visual mapping for ${kind}: ${id}`);
  return visual;
}
