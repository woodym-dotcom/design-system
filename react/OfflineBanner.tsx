/**
 * OfflineBanner — subscribes to window 'online'/'offline' events and
 * renders <StateBanner kind="offline" /> while navigator.onLine is false.
 */
import * as React from "react";
import { StateBanner } from "./StateBanner";

export interface OfflineBannerProps {
  /** Override the default banner copy. */
  message?: string;
  className?: string;
}

function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine !== false;
}

export function OfflineBanner({
  message,
  className,
}: OfflineBannerProps): React.ReactElement | null {
  const [online, setOnline] = React.useState<boolean>(isOnline);

  React.useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    // In case events fired before mount.
    setOnline(isOnline());
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online) return null;
  return (
    <StateBanner
      kind="offline"
      description={message}
      className={className}
    />
  );
}
