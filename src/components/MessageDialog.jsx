import { useEffect, useRef, useState } from 'react';
import { X } from '@phosphor-icons/react';
import FramedPanel from './FramedPanel';
import Stepper, { Step } from './Stepper';
import { useLanguage } from '../i18n/LanguageContext';
import './MessageDialog.css';

export default function MessageDialog({ open, onClose }) {
  const { t } = useLanguage();
  const f = t.messageForm;
  const { email: toEmail } = t.contact;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);

  const nameInputRef = useRef(null);
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    nameInputRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setMessage('');
      setStep(1);
      setSent(false);
    }
  }, [open]);

  if (!open) return null;

  // Per-step gating instead of a submit-time error: the Continue button
  // stays disabled until the current step's required field is filled.
  const nextDisabled = (step === 1 && !name.trim()) || (step === 3 && !message.trim());

  const handleComplete = () => {
    const subject = `Portfolio message from ${name.trim()}`;
    const bodyLines = [message.trim(), '', `${f.nameLabel}: ${name.trim()}`];
    if (email.trim()) bodyLines.push(`${f.emailLabel}: ${email.trim()}`);
    const body = bodyLines.join('\n');

    window.location.href = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="message-dialog__backdrop" onMouseDown={handleBackdropClick}>
      <div
        className="message-dialog__wrap"
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-dialog-title"
        ref={panelRef}
      >
        <FramedPanel variant="corners" className="message-dialog__panel">
          <button type="button" className="message-dialog__close" onClick={onClose} aria-label={f.closeLabel}>
            <X size={18} weight="light" />
          </button>

          {sent ? (
            <div className="message-dialog__success">
              <h3 id="message-dialog-title">{f.successTitle}</h3>
              <p>{f.successBody}</p>
              <button type="button" className="message-dialog__submit" onClick={onClose}>
                {f.closeLabel}
              </button>
            </div>
          ) : (
            <div>
              <h3 id="message-dialog-title">{f.title}</h3>
              <p className="message-dialog__intro">{f.intro}</p>

              <Stepper
                initialStep={1}
                onStepChange={setStep}
                onFinalStepCompleted={handleComplete}
                backButtonText={f.backLabel}
                nextButtonText={f.nextLabel}
                completeButtonText={f.submitLabel}
                nextButtonProps={{ disabled: nextDisabled }}
                disableStepIndicators
              >
                <Step>
                  <div className="message-dialog__field">
                    <label htmlFor="msg-name">{f.nameLabel}</label>
                    <input
                      id="msg-name"
                      ref={nameInputRef}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={f.namePlaceholder}
                      autoComplete="name"
                    />
                  </div>
                </Step>
                <Step>
                  <div className="message-dialog__field">
                    <label htmlFor="msg-email">{f.emailLabel}</label>
                    <input
                      id="msg-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={f.emailPlaceholder}
                      autoComplete="email"
                    />
                  </div>
                </Step>
                <Step>
                  <div className="message-dialog__field">
                    <label htmlFor="msg-message">{f.messageLabel}</label>
                    <textarea
                      id="msg-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={f.messagePlaceholder}
                    />
                  </div>
                </Step>
              </Stepper>
            </div>
          )}
        </FramedPanel>
      </div>
    </div>
  );
}
