import RevealSection from './RevealSection';
import { useLanguage } from '../i18n/LanguageContext';
import './BuildStory.css';

/**
 * Scene 6: how this site was made. The build process itself is the
 * evidence — AI collaboration directed by human taste — so it reads
 * as a five-step flow with the takeaway as the closing line.
 */
export default function BuildStory() {
  const { t } = useLanguage();
  const { buildStory } = t;

  return (
    <section id="scene-6" className="build-story">
      <div className="container">
        <RevealSection className="build-story__heading">
          <p className="eyebrow">{buildStory.eyebrow}</p>
          <h2>{buildStory.heading}</h2>
          <p className="build-story__intro">{buildStory.intro}</p>
        </RevealSection>

        <RevealSection delay={0.15}>
          <ol className="build-story__steps">
            {buildStory.steps.map((step, index) => (
              <li key={step.key} className="build-story__step">
                <span className="build-story__step-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.label}</h3>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </RevealSection>

        <RevealSection delay={0.25}>
          <p className="build-story__takeaway">{buildStory.takeaway}</p>
        </RevealSection>
      </div>
    </section>
  );
}
