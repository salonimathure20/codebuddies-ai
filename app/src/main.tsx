import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "store/index.ts";
import { RouterProvider } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { routes } from "routes/routes.tsx";
import i18n from "./i18n"; // Import i18n instance

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <RouterProvider router={routes}></RouterProvider>
      </Provider>
    </I18nextProvider>
  
  
  </StrictMode>
);
