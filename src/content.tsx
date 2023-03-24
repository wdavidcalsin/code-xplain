import React from "react";
import ReactDOM from "react-dom";
import { AppContent } from "./content-scripts";
import "./index.css";

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);

ReactDOM.render(
  <React.StrictMode>
    <AppContent />
  </React.StrictMode>,
  root
);
