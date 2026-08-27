export const STATIONS = [
  { id: 'cockpit', route: '/', zh: '駕駛艙', en: 'Cockpit', purpose: { zh: '航行首頁', en: 'Home' }, next: 'profile' },
  { id: 'profile', route: '/profile', zh: '艦長辦公室', en: "Captain's Office", purpose: { zh: '關於我', en: 'About me' }, next: 'career-tree' },
  { id: 'career-tree', route: '/career-tree', zh: '航跡樹站', en: 'Route Tree Station', purpose: { zh: '經歷與遊戲', en: 'Experience & games' }, next: 'portfolio' },
  { id: 'portfolio', route: '/portfolio', zh: '影像分析艙', en: 'Analysis Bay', purpose: { zh: '行銷案例', en: 'Marketing cases' }, next: 'cockpit' },
  { id: 'ai-lab', route: '/ai-lab', zh: 'AI 實驗艙', en: 'AI Lab', purpose: { zh: 'AI 協作與史達普', en: 'AI collaboration & Stapu' }, next: 'cockpit' },
  { id: 'making-of', route: '/making-of', zh: '網站製作檔案', en: 'Making-of Archive', purpose: { zh: '網站製作過程', en: 'Website process' } },
];

export function getStationByRoute(route) {
  return STATIONS.find((station) => station.route === route);
}

export function getRecommendedNext(route) {
  const station = getStationByRoute(route) ?? STATIONS.find((candidate) => candidate.id === route);
  return station?.next ? STATIONS.find((candidate) => candidate.id === station.next) : undefined;
}
