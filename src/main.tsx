import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";

import "@fontsource/noto-sans-sinhala/400.css";
import "@fontsource/noto-sans-sinhala/600.css";
import "@fontsource/noto-serif-sinhala/400.css";
import "@fontsource/noto-serif-sinhala/600.css";

import App from "./App";
import { store } from "./store";

import "./index.css";

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
