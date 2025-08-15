import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Removed leaflet import for Expo compatibility




createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
