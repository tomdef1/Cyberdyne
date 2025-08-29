import { useEffect, useRef } from 'react';

export default function Modal({ open, onClose, title = 'Notice', children }) {
  const dialogRef = useRef(null);
  const lastFocused = useRef(null);

  // manage focus when opening/closing
  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement;
      // slight delay to ensure in DOM
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 0);
      const handleKey = (e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
        } else if (e.key === 'Tab') {
          // simple focus trap
          const focusables = dialogRef.current?.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusables || focusables.length === 0) return;
          const first = focusables[0];
            const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKey, true);
      return () => document.removeEventListener('keydown', handleKey, true);
    } else if (lastFocused.current) {
      lastFocused.current.focus();
    }
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" role="presentation" onMouseDown={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <header className="modal__header">
          <h2 id="modal-title">{title}</h2>
        </header>
        <div className="modal__body">{children}</div>
        <div className="modal__actions">
          <button onClick={onClose} autoFocus>Close</button>
        </div>
      </div>
    </div>
  );
}
