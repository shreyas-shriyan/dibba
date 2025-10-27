import { render } from "preact";
import { App } from "./App.js";
import { ToastProvider } from "./components/Toast";
import "./style.css";

render(
  <ToastProvider>
    <App />
  </ToastProvider>,
  document.getElementById("app")
);
