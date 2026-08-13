export function getSiteRoute(pathname = window.location.pathname) {
  const routes = {
    '/': 'cockpit',
    '/profile': 'profile',
    '/career-tree': 'career-tree',
    '/portfolio': 'portfolio',
    '/making-of': 'making-of',
  };

  return routes[pathname] ?? 'cockpit';
}

export function navigateToRoute(pathname) {
  window.history.pushState({}, '', pathname);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
