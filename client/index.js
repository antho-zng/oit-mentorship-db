import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import history from "./history";
import store from "./store";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
const APP_ENV = process.env.REACT_APP_ENV;

const root = createRoot(document.getElementById("app"));
root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Router history={history}>
        <React.StrictMode>
          {APP_ENV === "DEV" && <ReactQueryDevtools />}
          <App />
        </React.StrictMode>
      </Router>
    </QueryClientProvider>
  </Provider>
);
