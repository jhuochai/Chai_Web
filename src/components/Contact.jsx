import { useState } from 'react';
import { EnvelopeSimple, LinkedinLogo, FileArrowDown, ChatCircleText } from '@phosphor-icons/react';
import RevealSection from './RevealSection';
import MessageDialog from './MessageDialog';
import { useLanguage } from '../i18n/LanguageContext';
import './Contact.css';

export default function Contact() {
  const { t } = useLanguage();
  const { contact, closingStatement, ui, messageForm } = t;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section id="scene-7" className="closing">
      <div className="closing__fog" aria-hidden="true" />
      <div className="closing__content container">
        <RevealSection as="div">
          <h2 className="closing__statement">{closingStatement}</h2>
        </RevealSection>

        <RevealSection as="div" delay={0.1} className="closing__links-wrap">
            <ul className="closing__links" aria-label={t.nav?.contact ?? 'Contact'}>
              <li>
                <a href={`mailto:${contact.email}`}>
                  <EnvelopeSimple size={20} weight="light" />
                  <span>{contact.email}</span>
                </a>
              </li>
              <li>
                {contact.linkedin ? (
                  <a href={contact.linkedin} target="_blank" rel="noreferrer">
                    <LinkedinLogo size={20} weight="light" />
                    <span>LinkedIn</span>
                  </a>
                ) : (
                  <span className="closing__links-pending">
                    <LinkedinLogo size={20} weight="light" />
                    <span>{contact.linkedinPlaceholder}</span>
                  </span>
                )}
              </li>
              <li>
                <a href={contact.resumeUrl} download>
                  <FileArrowDown size={20} weight="light" />
                  <span>{contact.resumeLabel}</span>
                </a>
              </li>
            </ul>
        </RevealSection>

        <RevealSection as="div" delay={0.15}>
          <button
            type="button"
            className="closing__message-btn btn-glass btn-glass--ghost"
            onClick={() => setDialogOpen(true)}
          >
            <ChatCircleText size={16} weight="light" />
            {messageForm.triggerLabel}
          </button>
        </RevealSection>
      </div>

      <div className="closing__foot">
        <span>{ui.footerTag}</span>
      </div>

      <MessageDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </section>
  );
}
