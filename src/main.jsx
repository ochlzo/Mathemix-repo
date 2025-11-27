// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
// import App1 from "./App1.jsx";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // <--- Import this

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* <--- Wrap App in BrowserRouter */}
      {/* <App1 /> */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
