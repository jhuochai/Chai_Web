import { navigateToRoute } from '../lib/siteRoute';
import { ArrowLeft, Archive, Sparkle } from '@phosphor-icons/react';
import { useLanguage } from '../i18n/LanguageContext';
import './MakingOf.css';

export default function MakingOf() {
  const { lang, t } = useLanguage();
  const { makingOf } = t;
  const labels = lang === 'zh'
    ? { archive: '廢案檔案室', back: '回到觀景台', note: '這裡保留的不只是成品，而是一路做決定的痕跡。' }
    : { archive: 'Discarded Draft Archive', back: 'Return to the observatory', note: 'Not just the outcome, but the decisions that shaped it.' };
  const returnToObservatory = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    navigateToRoute('/');
  };

  return (
    <main className="making-of">
      <header className="making-of__masthead container">
        <button className="making-of__back" type="button" onClick={returnToObservatory}>
          <ArrowLeft aria-hidden="true" size={18} />
          {labels.back}
        </button>
        <div className="making-of__title-lockup">
          <Archive aria-hidden="true" size={34} weight="light" />
          <div>
            <p>{labels.archive}</p>
            <h1 id="making-of-heading">{makingOf.heading}</h1>
          </div>
        </div>
        <p className="making-of__intro">{makingOf.intro}</p>
      </header>

      <section className="making-of__archive container" aria-labelledby="making-of-heading">
        <ol className="making-of__timeline">
          {makingOf.timeline.map((entry, index) => (
            <li key={entry.id} className="making-of__entry">
              <div className="making-of__rail" aria-hidden="true">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <article>
                <h2>{entry.label}</h2>
                <p>{entry.desc}</p>
                {entry.images?.length ? (
                  <div className="making-of__evidence">
                    {entry.images.map((image) => <img key={image.src} src={image.src} alt={image.alt} />)}
                  </div>
                ) : (
                  <p className="making-of__open-slot">
                    <Sparkle aria-hidden="true" size={14} />
                    {lang === 'zh' ? '保留給下一份對話、草稿或畫面' : 'Reserved for the next conversation, draft, or screen'}
                  </p>
                )}
              </article>
            </li>
          ))}
        </ol>
      </section>

      <footer className="making-of__footer container">
        <p>{labels.note}</p>
      </footer>
    </main>
  );
}
