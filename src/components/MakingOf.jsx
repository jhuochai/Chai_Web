import { navigateToRoute } from '../lib/siteRoute';
import { ArrowLeft, Archive, Sparkle } from '@phosphor-icons/react';
import { useLanguage } from '../i18n/LanguageContext';
import CollaboratorSeats from './CollaboratorSeats';
import './MakingOf.css';

export default function MakingOf() {
  const { lang, t } = useLanguage();
  const { makingOf } = t;
  const labels = lang === 'zh'
    ? { archive: '網站製作檔案', back: '回到駕駛艙', note: '這裡保存一路做決定的痕跡，也記下共同完成它的協作者。' }
    : { archive: 'Making-of Archive', back: 'Return to the cockpit', note: 'A record of the decisions and collaborators that shaped the work.' };
  const returnToCockpit = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    navigateToRoute('/');
  };

  return (
    <main className="making-of">
      <header className="making-of__masthead container">
        <button className="making-of__back" type="button" onClick={returnToCockpit}>
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
        <CollaboratorSeats />
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
