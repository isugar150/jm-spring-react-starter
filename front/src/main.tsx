import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { ThemeProvider } from "./components/theme-provider";
import { RadixThemeBridge } from "./components/RadixThemeBridge";
import { DialogProvider } from "./components/dialogs/DialogProvider";
import { ToastProvider } from "./components/toasts/ToastProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RadixThemeBridge>
        <QueryClientProvider client={queryClient}>
          <DialogProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </DialogProvider>
        </QueryClientProvider>
      </RadixThemeBridge>
    </ThemeProvider>
  </StrictMode>,
);
