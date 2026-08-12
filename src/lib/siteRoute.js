export function getSiteRoute(pathname = window.location.pathname) {
  return pathname === '/making-of' ? 'making-of' : 'home';
}

export function navigateToRoute(pathname) {
  window.history.pushState({}, '', pathname);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
