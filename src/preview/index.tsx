import Editor from "./Editor/Editor";
import React from "react";
import { createRoot } from "react-dom/client";

window.onload = () => {
  console.log("Loading preview");
  window.onmessage = (event) => {
    console.log("Received extension message: ", event.data);
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
    console.log(root);
    createRoot(root).render(<Editor glyphs={event.data?.glyphs} />);
  };
};
