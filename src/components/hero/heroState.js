const APPROACHED_KEY = 'hero-approached';

const actions = {
  intro: { kind: 'travel', target: '/profile', motion: 'turn' },
  career: { kind: 'travel', target: '/career-tree', motion: 'push' },
  portfolio: { kind: 'travel', target: '/portfolio', motion: 'pull' },
  'ai-lab': { kind: 'preview', target: '/ai-lab', motion: 'boot' },
};

export const getInitialHeroApproach = ({ reduce, storage }) =>
  reduce || storage?.getItem(APPROACHED_KEY) === '1' ? 1 : 0;

export const rememberHeroApproach = (storage) => storage?.setItem(APPROACHED_KEY, '1');

export const getDestinationAction = (id) => actions[id];
