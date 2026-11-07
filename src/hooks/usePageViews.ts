import { useEffect } from "react";
import { useLocation } from "react-router";

import { trackPageView } from "../analytics";

// Sends a page view for each screen. Waits a moment so the screen has set its
// title (usePageMeta), and so redirects and quick taps count only once.
export const usePageViews = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const id = window.setTimeout(() => trackPageView(pathname), 1000);
    return () => window.clearTimeout(id);
  }, [pathname]);
};
