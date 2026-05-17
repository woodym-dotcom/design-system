/**
 * Toast stories — provider, tones, action (Undo), auto-dismiss, sticky.
 */
import * as React from 'react';
import { ToastProvider, useToast } from '../react/Toast';

export default {
  title: 'Foundation/Toast',
  component: ToastProvider,
  parameters: { layout: 'fullscreen' },
};

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div style={{ padding: 24, minHeight: 240 }}>{children}</div>
    </ToastProvider>
  );
}

function Triggers() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button className="cc-btn" onClick={() => toast({ message: 'Saved.' })}>info</button>
      <button className="cc-btn" onClick={() => toast({ message: 'Profile saved.', tone: 'success' })}>success</button>
      <button className="cc-btn" onClick={() => toast({ message: 'API rate-limited.', tone: 'warning' })}>warning</button>
      <button className="cc-btn" onClick={() => toast({ message: 'Failed to save.', tone: 'error' })}>error</button>
      <button className="cc-btn" onClick={() => toast({ message: 'Deleted 3 vendors.', action: { label: 'Undo', onClick: () => {} } })}>with action</button>
      <button className="cc-btn" onClick={() => toast({ message: 'Sticky — click × to dismiss.', durationMs: 0 })}>sticky</button>
    </div>
  );
}

export function Default() {
  return (
    <Stage>
      <p>Click a button to fire a toast.</p>
      <Triggers />
    </Stage>
  );
}

export function AllTones() {
  function FireOnMount() {
    const { toast } = useToast();
    React.useEffect(() => {
      toast({ title: 'Info', message: 'Background sync queued.', tone: 'info', durationMs: 0 });
      toast({ title: 'Saved', message: 'Profile updated.', tone: 'success', durationMs: 0 });
      toast({ title: 'Slow down', message: 'Upstream is throttled.', tone: 'warning', durationMs: 0 });
      toast({ title: 'Failed', message: 'Connection refused.', tone: 'error', durationMs: 0 });
    }, [toast]);
    return null;
  }
  return (
    <Stage>
      <p>All four tones, sticky for snapshot capture.</p>
      <FireOnMount />
    </Stage>
  );
}
