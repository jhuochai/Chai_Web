import { ArrowRight, CookingPot, GameController } from '@phosphor-icons/react';
import RevealSection from './RevealSection';
import { useLanguage } from '../i18n/LanguageContext';
import './Interests.css';

const HOBBY_ICONS = {
  cooking: CookingPot,
  gaming: GameController,
};

/**
 * Scene 4: hobbies and strengths, tied together by one insight — the
 * create → immerse → share loop is the same whether the arena is a
 * kitchen, a ranked queue, or a brand's social feed. Lighter in tone
 * than the work scenes on purpose: this is the "person" section.
 */
export default function Interests() {
  const { t } = useLanguage();
  const { interests } = t;

  return (
    <section id="scene-4" className="interests">
      <div className="container">
        <RevealSection className="interests__heading">
          <p className="eyebrow">{interests.eyebrow}</p>
          <h2>{interests.heading}</h2>
          <p className="interests__insight">{interests.insight}</p>
        </RevealSection>

        <RevealSection delay={0.1}>
          <ol className="interests__loop">
            {interests.loop.map((step, index) => (
              <li key={step.key} className="interests__loop-step">
                <span className="interests__loop-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="interests__loop-label">{step.label}</span>
                <span className="interests__loop-desc">{step.desc}</span>
                {index < interests.loop.length - 1 && (
                  <ArrowRight size={18} weight="light" className="interests__loop-arrow" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </RevealSection>

        <div className="interests__grid">
          <RevealSection delay={0.15} className="interests__hobbies">
            {interests.hobbies.map((hobby) => {
              const Icon = HOBBY_ICONS[hobby.id];
              return (
                <article key={hobby.id} className="interests__hobby">
                  {Icon && <Icon size={30} weight="light" className="interests__hobby-icon" aria-hidden="true" />}
                  <h3>{hobby.name}</h3>
                  <p>{hobby.desc}</p>
                </article>
              );
            })}
          </RevealSection>

          <RevealSection delay={0.25} className="interests__strengths">
            <p className="interests__strengths-label">{interests.strengthsLabel}</p>
            {interests.strengths.map((strength) => (
              <article key={strength.id} className="interests__strength">
                <h3>{strength.title}</h3>
                <p>{strength.desc}</p>
              </article>
            ))}
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
