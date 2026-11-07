import { useSyncExternalStore } from "react";

// "Add to home screen" support.
// Chrome, Edge and Samsung Internet (Android) fire `beforeinstallprompt`,
// which lets the app show its own install button. Safari on iPhone and iPad
// has no such event, so there we show the steps instead.

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallKind = "prompt" | "ios" | null;

let deferred: InstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac.
  (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1);

// Called once at start-up: the event can fire before any screen is shown.
export const listenForInstall = () => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // Show our own card instead of the browser's mini bar.
    deferred = event as InstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    deferred = null;
    notify();
  });
};

const getKind = (): InstallKind => {
  if (installed || isStandalone()) return null;
  if (deferred) return "prompt";
  return isIos() ? "ios" : null;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useInstallKind = () => useSyncExternalStore(subscribe, getKind);

// Shows the browser's install dialog. Resolves to true if the user installed.
export const promptInstall = async () => {
  const event = deferred;
  if (!event) return false;
  deferred = null; // The event can be used only once.
  notify();
  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome === "accepted";
};
