import { Lightning, Stack, PaintBrushBroad, EnvelopeSimple, LinkedinLogo, FileArrowDown } from '@phosphor-icons/react';
import FramedPanel from './FramedPanel';
import RevealSection from './RevealSection';
import { useLanguage } from '../i18n/LanguageContext';
import './About.css';

const traitIcons = {
  efficiency: Lightning,
  multitasking: Stack,
  creativity: PaintBrushBroad,
};

export default function About() {
  const { t } = useLanguage();
  const { title, traits, personalityBlurb, experience, highlights, skills, credentials, contact, ui, name } = t;

  return (
    <section id="about" className="about">
      <div className="container about__grid">
        <RevealSection as="div" className="about__visual">
          <FramedPanel variant="corners" className="about__portrait">
            <img
              src="https://picsum.photos/seed/coordinator-portrait/900/1100"
              alt={`${name.display} portrait placeholder`}
              loading="lazy"
            />
          </FramedPanel>
          <p className="about__portrait-note">{ui.portraitNote}</p>
        </RevealSection>

        <div className="about__body">
          <RevealSection as="div" delay={0.05}>
            <h2 className="about__title">{title}</h2>
            <ul className="about__traits">
              {traits.map((trait) => {
                const Icon = traitIcons[trait.key];
                return (
                  <li key={trait.key} className="about__trait">
                    <Icon size={18} weight="light" className="about__trait-icon" />
                    <div>
                      <span className="about__trait-label">{trait.label}</span>
                      <p className="about__trait-desc">{trait.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="about__blurb">{personalityBlurb}</p>
          </RevealSection>

          <RevealSection as="div" delay={0.1} className="about__timeline">
            <h3 className="about__subheading">{ui.timelineHeading}</h3>
            {experience.map((job) => (
              <div className="about__job" key={job.org}>
                <div className="about__job-head">
                  <span className="about__job-org">{job.org}</span>
                  <span className="about__job-role">{job.role}</span>
                  <span className="about__job-period">{job.period}</span>
                </div>
                <div className="about__job-products">
                  {job.products.map((p) => (
                    <span key={p} className="about__job-product">
                      {p}
                    </span>
                  ))}
                </div>
                <ul className="about__job-points">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </RevealSection>

          <RevealSection as="div" delay={0.12} className="about__stats">
            {highlights.map((h) => (
              <div className="about__stat" key={h.label}>
                <span className="about__stat-value">{h.value}</span>
                <span className="about__stat-label">{h.label}</span>
                <span className="about__stat-note">{h.note}</span>
              </div>
            ))}
          </RevealSection>

          <RevealSection as="div" delay={0.14} className="about__skills">
            <div className="about__skill-group">
              <span className="about__skill-group-label">{skills.primary.label}</span>
              <ul className="about__tags about__tags--primary">
                {skills.primary.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="about__skill-group">
              <span className="about__skill-group-label">{skills.secondary.label}</span>
              <ul className="about__tags about__tags--secondary">
                {skills.secondary.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="about__skill-group">
              <span className="about__skill-group-label">{ui.credentialsLabel}</span>
              <ul className="about__tags about__tags--secondary">
                {credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </RevealSection>

          <RevealSection as="div" delay={0.16} className="about__contact-tail">
            <a href={`mailto:${contact.email}`} className="about__contact-link">
              <EnvelopeSimple size={16} weight="light" />
              {contact.email}
            </a>
            {contact.linkedin ? (
              <a href={contact.linkedin} className="about__contact-link">
                <LinkedinLogo size={16} weight="light" />
                LinkedIn
              </a>
            ) : (
              <span className="about__contact-link about__contact-link--pending">
                <LinkedinLogo size={16} weight="light" />
                {contact.linkedinPlaceholder}
              </span>
            )}
            <a href={contact.resumeUrl} className="about__contact-link" download>
              <FileArrowDown size={16} weight="light" />
              {contact.resumeLabel}
            </a>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
