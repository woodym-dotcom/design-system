import * as React from 'react';
import { createPortal } from 'react-dom';
import { useAnnounce } from './a11y/LiveRegion';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  title?: string;
  message: string;
  tone?: ToastTone;
  /** Auto-dismiss after this many ms. 0 = sticky. Default 5000. */
  durationMs?: number;
  /** Single action (often "Undo"). Renders as a button on the toast. */
  action?: ToastAction;
}

export type ToastInput = Omit<Toast, 'id'> & {
  id?: string;
  /** @deprecated Use message instead. Alias for message. If both set, description wins. */
  description?: string;
};

export interface ToastContextValue {
  toast: (input: ToastInput) => string;
  /** @deprecated Use toast() instead. */
  push: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  /** Subscribers can read the live list (e.g. for tests/devtools). */
  toasts: ReadonlyArray<Toast>;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum visible toasts; older ones drop off the top. Default 5. */
  max?: number;
  /** Render position. Default 'bottom-right'. */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center';
}

let idCounter = 0;
const nextId = () => `toast-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

export function ToastProvider({
  children,
  max = 5,
  position = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const announce = useAnnounce();
  const timers = React.useRef(new Map<string, number>());

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const toast = React.useCallback(
    (input: ToastInput): string => {
      const id = input.id ?? nextId();
      const effectiveMessage = input.description ?? input.message;
      const entry: Toast = {
        durationMs: 5000,
        tone: 'info',
        ...input,
        message: effectiveMessage,
        id,
      };
      setToasts((prev) => {
        const next = [...prev.filter((t) => t.id !== id), entry];
        return next.length > max ? next.slice(next.length - max) : next;
      });
      announce(
        entry.title ? `${entry.title}. ${entry.message}` : entry.message,
        entry.tone === 'error' || entry.tone === 'warning' ? 'assertive' : 'polite',
      );
      if (entry.durationMs && entry.durationMs > 0) {
        const handle = window.setTimeout(() => dismiss(id), entry.durationMs);
        timers.current.set(id, handle);
      }
      return id;
    },
    [announce, dismiss, max],
  );

  const clear = React.useCallback(() => {
    timers.current.forEach((h) => window.clearTimeout(h));
    timers.current.clear();
    setToasts([]);
  }, []);

  React.useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach((h) => window.clearTimeout(h));
      t.clear();
    };
  }, []);

  const value = React.useMemo<ToastContextValue>(
    () => ({ toast, push: toast, dismiss, clear, toasts }),
    [toast, dismiss, clear, toasts],
  );

  const stack = (
    <div
      className={`cc-toast-stack cc-toast-stack--${position}`}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(stack, document.body)
        : stack}
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const tone = toast.tone ?? 'info';
  return (
    <div
      className={`cc-toast cc-toast--${tone}`}
      role={tone === 'error' || tone === 'warning' ? 'alert' : 'status'}
      data-toast-id={toast.id}
    >
      <div className="cc-toast__body">
        {toast.title && <p className="cc-toast__title">{toast.title}</p>}
        <p className="cc-toast__message">{toast.message}</p>
      </div>
      <div className="cc-toast__actions">
        {toast.action && (
          <button
            type="button"
            className="cc-toast__action"
            onClick={() => {
              toast.action!.onClick();
              onDismiss();
            }}
          >
            {toast.action.label}
          </button>
        )}
        <button
          type="button"
          className="cc-toast__close"
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    // Soft fallback — primitives may call useToast unconditionally.
    const noop = () => '';
    return {
      toast: noop,
      push: noop,
      dismiss: () => {},
      clear: () => {},
      toasts: [],
    };
  }
  return ctx;
}
