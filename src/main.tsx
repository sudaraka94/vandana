import React from "react";
import { createRoot } from "react-dom/client";

import "./fonts.css";
import "./index.css";

import App from "./App";
import { startAnalytics } from "./analytics";
import { listenForInstall } from "./install";
import { loadMenu } from "./menu";

// Start fetching the list of texts before React renders.
loadMenu();
listenForInstall();

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

startAnalytics();
