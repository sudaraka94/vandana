// Google Analytics 4 (gtag.js), web stream "Sudaraka94" for vandana.sudaraka94.com.
const MEASUREMENT_ID = "G-YEGG1L9YEX";
const enabled = import.meta.env.PROD;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// Calls are queued in dataLayer until gtag.js arrives, so nothing is lost.
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag() {
  // gtag.js expects the `arguments` object itself, not an array.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
};
window.gtag("js", new Date());
// Page views are sent by trackPageView, once each screen has its title.
window.gtag("config", MEASUREMENT_ID, { send_page_view: false });

export const trackPageView = (path: string) => {
  if (!enabled) return;
  window.gtag("event", "page_view", {
    page_location: window.location.origin + path,
    page_path: path,
    page_title: document.title,
  });
};

// The analytics script is loaded after the page is ready and the browser is
// idle, so it never holds up the first paint.
export const startAnalytics = () => {
  if (!enabled) return;
  const start = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  };
  const whenIdle = () => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(start, { timeout: 5000 });
    else setTimeout(start, 2000); // Safari
  };
  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
};
