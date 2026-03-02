import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import ModalProvider from "./providers/modal-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <App />
        <Toaster position="bottom-right" richColors />
        <ModalProvider />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
