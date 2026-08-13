import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import CaseStack from './CaseStack';
import './CaseAnalysisDesk.css';

function getFocusable(container) {
  return Array.from(
    container?.querySelectorAll(
      'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])'
    ) ?? []
  ).filter((node) => !node.hasAttribute('inert') && node.getAttribute('aria-hidden') !== 'true');
}

export default function CaseAnalysisDesk({ caseData, copy, onClose }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    setIndex(0);
  }, [caseData.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const overlay = dialogRef.current?.closest('.case-analysis');
    const backgroundNodes = Array.from(document.body.children).filter((node) => node !== overlay);
    const previousState = backgroundNodes.map((node) => ({
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

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable(dialogRef.current);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousState.forEach(({ node, inert, ariaHidden }) => {
        if (!inert) node.removeAttribute('inert');
        if (ariaHidden === null) node.removeAttribute('aria-hidden');
        else node.setAttribute('aria-hidden', ariaHidden);
      });
    };
  }, [onClose]);

  const activeItem = caseData.items[index] ?? caseData.items[0];
  const titleId = `case-analysis-${caseData.id}-title`;
  const titleSeparator = /^[\u3400-\u9fff]/.test(copy.dialogSuffix) ? '' : ' ';

  return createPortal(
    <div
      className="case-analysis"
      data-testid="case-analysis-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        ref={dialogRef}
        className="case-analysis__desk"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="case-analysis__rail" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <header className="case-analysis__header">
          <div>
            <span className="case-analysis__eyebrow">CASE / {caseData.id.toUpperCase()}</span>
            <h2 id={titleId}>{caseData.title}{titleSeparator}{copy.dialogSuffix}</h2>
          </div>
          <button ref={closeRef} type="button" className="case-analysis__close" aria-label={copy.close} onClick={onClose}>
            <X size={24} aria-hidden="true" />
          </button>
        </header>

        <div className="case-analysis__body">
          <CaseStack items={caseData.items} index={index} onIndexChange={setIndex} copy={copy} />

          <div className="case-analysis__readout" aria-live="polite">
            <section>
              <h3>{copy.purpose}</h3>
              <p>{activeItem.purpose}</p>
            </section>
            <section>
              <h3>{copy.role}</h3>
              <p>{activeItem.role}</p>
            </section>
            <section>
              <h3>{copy.evidence}</h3>
              <ul aria-label={copy.evidence}>
                {activeItem.proof.map((fact) => <li key={fact}>{fact}</li>)}
              </ul>
            </section>
            <section>
              <h3>{copy.learning}</h3>
              <p>{activeItem.learning}</p>
            </section>
          </div>
        </div>
      </article>
    </div>,
    document.body
  );
}
