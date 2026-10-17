import "@fontsource/syne/latin-500.css";
import "@fontsource/syne/latin-600.css";
import "@fontsource/syne/latin-700.css";
import "@fontsource/syne/latin-800.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "./styles/portfolio.css";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const mount = document.getElementById("root");
if (mount) {
  const root = createRoot(mount);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}