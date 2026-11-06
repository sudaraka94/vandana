import { useEffect } from "react";

interface WakeLockSentinelLike {
  release: () => Promise<void>;
}

// Keeps the screen on while `enabled` is true, where the browser allows it.
export const useWakeLock = (enabled: boolean) => {
  useEffect(() => {
    const wakeLock = (navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
    }).wakeLock;
    if (!enabled || !wakeLock) return;

    let sentinel: WakeLockSentinelLike | null = null;
    let active = true;

    const request = () => {
      if (document.visibilityState !== "visible") return;
      wakeLock.request("screen").then(
        (s) => {
          if (active) sentinel = s;
          else s.release().catch(() => undefined);
        },
        () => undefined // Refused (battery saver, unsupported); nothing to do.
      );
    };

    request();
    // The lock is dropped when the tab is hidden; take it again on return.
    document.addEventListener("visibilitychange", request);
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", request);
      sentinel?.release().catch(() => undefined);
    };
  }, [enabled]);
};
