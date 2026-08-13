import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Broadcast,
  ChatCircleText,
  EnvelopeSimple,
  FileArrowDown,
  LinkedinLogo,
  X,
} from '@phosphor-icons/react';
import MessageDialog from './MessageDialog';
import { useLanguage } from '../i18n/LanguageContext';
import { buildContactLinkData } from '../lib/contactLinks';
import './Contact.css';

const copy = {
  en: {
    title: 'Comms',
    label: 'Ship communications console',
    close: 'Close communications console',
    channel: 'Secure channel 01',
    status: 'Signal locked · ready to receive',
    links: 'Verified communication channels',
  },
  zh: {
    title: '通訊台',
    label: '飛船通訊台',
    close: '關閉通訊台',
    channel: '安全頻道 01',
    status: '訊號鎖定 · 可以開始聯繫',
    links: '已驗證的聯絡方式',
  },
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function resolveFocusTarget(target) {
  if (typeof target === 'function') return target();
  if (target && 'current' in target) return target.current;
  return target;
}

export default function Contact({ open = false, onClose = () => {}, returnFocusTo = null }) {
  const { lang, t } = useLanguage();
  const { contact, messageForm } = t;
  const labels = copy[lang];
  const [dialogOpen, setDialogOpen] = useState(false);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const messageTriggerRef = useRef(null);
  const focusTimerRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const returnFocusRef = useRef(returnFocusTo);
  const messageOpenRef = useRef(dialogOpen);
  const contactLinks = buildContactLinkData(contact);
  const linkIcons = {
    email: <EnvelopeSimple aria-hidden="true" size={22} weight="light" />,
    linkedin: <LinkedinLogo aria-hidden="true" size={22} weight="light" />,
    resume: <FileArrowDown aria-hidden="true" size={22} weight="light" />,
  };

  onCloseRef.current = onClose;
  returnFocusRef.current = returnFocusTo;
  messageOpenRef.current = dialogOpen;

  useEffect(() => {
    if (open) return;
    messageOpenRef.current = false;
    setDialogOpen(false);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const backgroundNodes = Array.from(document.body.children).filter(
      (node) => !node.classList.contains('comms-panel')
    );
    const previousBackgroundState = backgroundNodes.map((node) => ({
      node,
      inert: node.hasAttribute('inert'),
      ariaHidden: node.getAttribute('aria-hidden'),
    }));

    document.body.style.overflow = 'hidden';
    backgroundNodes.forEach((node) => {
      node.setAttribute('inert', '');
      node.setAttribute('aria-hidden', 'true');
    });
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (messageOpenRef.current) return;
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;
      const scope = messageOpenRef.current
        ? document.querySelector('.message-dialog__wrap')
        : panelRef.current;
      const focusable = Array.from(scope?.querySelectorAll(focusableSelector) ?? [])
        .filter((node) => node.getAttribute('aria-hidden') !== 'true');
      if (!focusable.length) {
        event.preventDefault();
        scope?.focus?.();
        return;
      }

      const first = focusable[0];
      const last = focusable.at(-1);
      if (!scope?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousBackgroundState.forEach(({ node, inert, ariaHidden }) => {
        if (!inert) node.removeAttribute('inert');
        if (ariaHidden === null) node.removeAttribute('aria-hidden');
        else node.setAttribute('aria-hidden', ariaHidden);
      });
      window.clearTimeout(focusTimerRef.current);
      focusTimerRef.current = window.setTimeout(() => {
        resolveFocusTarget(returnFocusRef.current)?.focus?.();
      }, 0);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(focusTimerRef.current), []);

  if (!open) return null;

  const closeMessage = () => {
    messageOpenRef.current = false;
    setDialogOpen(false);
    window.clearTimeout(focusTimerRef.current);
    focusTimerRef.current = window.setTimeout(() => messageTriggerRef.current?.focus(), 0);
  };

  return createPortal(
    <div
      className="comms-panel"
      data-testid="comms-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !dialogOpen) onClose();
      }}
    >
      <section
        ref={panelRef}
        className="comms-panel__console"
        role="dialog"
        aria-modal="true"
        aria-label={labels.label}
        tabIndex="-1"
      >
        <div className="comms-panel__hardware" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <header className="comms-panel__head">
          <div className="comms-panel__signal" aria-hidden="true">
            <Broadcast size={28} weight="light" />
            <span /><span /><span />
          </div>
          <div>
            <p>{labels.channel}</p>
            <h2>{labels.title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="comms-panel__close"
            aria-label={labels.close}
            onClick={onClose}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </header>

        <p className="comms-panel__status"><span aria-hidden="true" />{labels.status}</p>

        <ul className="comms-panel__links" aria-label={labels.links}>
          {contactLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                download={link.download || undefined}
              >
                {linkIcons[link.id]}
                <span>{link.label}</span>
                <i aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <button
          ref={messageTriggerRef}
          type="button"
          className="comms-panel__message"
          onClick={() => {
            messageOpenRef.current = true;
            setDialogOpen(true);
          }}
        >
          <ChatCircleText aria-hidden="true" size={21} weight="light" />
          {messageForm.triggerLabel}
        </button>

        <MessageDialog open={dialogOpen} onClose={closeMessage} />
      </section>
    </div>,
    document.body
  );
}
