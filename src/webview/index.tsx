import { createRoot } from "react-dom/client";
import { App } from "./app/app";

window.addEventListener("load", () => {
  createRoot(document.getElementById("root")).render(<App />);
});
