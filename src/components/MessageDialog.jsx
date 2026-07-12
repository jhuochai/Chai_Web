import { useEffect, useRef, useState } from 'react';
import { X, PaperPlaneTilt } from '@phosphor-icons/react';
import FramedPanel from './FramedPanel';
import { useLanguage } from '../i18n/LanguageContext';
import './MessageDialog.css';

export default function MessageDialog({ open, onClose }) {
  const { t } = useLanguage();
  const f = t.messageForm;
  const { email: toEmail } = t.contact;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const nameInputRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    nameInputRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setMessage('');
      setError('');
      setSent(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError(f.errorRequired);
      return;
    }
    setError('');

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
            <form onSubmit={handleSubmit} noValidate>
              <h3 id="message-dialog-title">{f.title}</h3>
              <p className="message-dialog__intro">{f.intro}</p>

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

              {error ? (
                <p className="message-dialog__error" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="message-dialog__actions">
                <button type="button" className="message-dialog__cancel" onClick={onClose}>
                  {f.cancelLabel}
                </button>
                <button type="submit" className="message-dialog__submit">
                  <PaperPlaneTilt size={15} weight="light" />
                  {f.submitLabel}
                </button>
              </div>
            </form>
          )}
        </FramedPanel>
      </div>
    </div>
  );
}
