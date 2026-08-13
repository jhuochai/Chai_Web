export const STATIONS = [
  { id: 'cockpit', route: '/', zh: '駕駛艙', en: 'Cockpit', next: 'profile' },
  { id: 'profile', route: '/profile', zh: '艦長辦公室', en: "Captain's Office", next: 'career-tree' },
  { id: 'career-tree', route: '/career-tree', zh: '航跡樹站', en: 'Route Tree Station', next: 'portfolio' },
  { id: 'portfolio', route: '/portfolio', zh: '影像分析艙', en: 'Analysis Bay', next: 'cockpit' },
  { id: 'making-of', route: '/making-of', zh: '網站製作檔案', en: 'Making-of Archive' },
];

export function getStationByRoute(route) {
  return STATIONS.find((station) => station.route === route);
}

export function getRecommendedNext(route) {
  const station = getStationByRoute(route) ?? STATIONS.find((candidate) => candidate.id === route);
  return station?.next ? STATIONS.find((candidate) => candidate.id === station.next) : undefined;
}
