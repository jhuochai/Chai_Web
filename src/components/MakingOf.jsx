import { navigateToRoute } from '../lib/siteRoute';

export default function MakingOf() {
  return (
    <main>
      <section aria-labelledby="making-of-heading">
        <h1 id="making-of-heading">網站製作幕後</h1>
        <button type="button" onClick={() => navigateToRoute('/')}>
          回到首頁
        </button>
      </section>
    </main>
  );
}
