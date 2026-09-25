export function getSiteRoute(pathname = window.location.pathname) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const localPath = base && (pathname === base || pathname.startsWith(`${base}/`))
    ? pathname.slice(base.length) : pathname;
  const routes = {
    '/': 'cockpit',
    '/profile': 'profile',
    '/career-tree': 'career-tree',
    '/portfolio': 'portfolio',
    '/ai-lab': 'ai-lab',
    '/making-of': 'making-of',
  };

  return routes[localPath.replace(/\/$/, '') || '/'] ?? 'cockpit';
}

export function navigateToRoute(pathname) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  window.history.pushState({}, '', `${base}${pathname}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
