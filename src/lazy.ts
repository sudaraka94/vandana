import { lazy, type ComponentType } from "react";

const RELOADED = "vandanaChunkReload";

// React.lazy, but if the code can't be fetched because a new version was
// deployed (old file names are gone), reload the page once to get the new one.
export const lazyWithReload = <T extends ComponentType<any>>(load: () => Promise<{ default: T }>) =>
  lazy(() =>
    load().then(
      (module) => {
        try {
          sessionStorage.removeItem(RELOADED);
        } catch {
          // Storage unavailable; nothing to clear.
        }
        return module;
      },
      (error) => {
        let reloaded = false;
        try {
          reloaded = sessionStorage.getItem(RELOADED) === "1";
          sessionStorage.setItem(RELOADED, "1");
        } catch {
          reloaded = true; // Can't guard against a loop, so don't reload.
        }
        if (reloaded || !navigator.onLine) throw error;
        window.location.reload();
        return new Promise<never>(() => undefined);
      }
    )
  );
