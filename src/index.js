import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Send web vitals to Google Analytics
const sendToGoogleAnalytics = ({ name, delta, value, id }) => {
  gtag("event", name, {
    value: delta,
    metric_id: id,
    metric_value: value,
    metric_delta: delta,
  });
};

reportWebVitals(sendToGoogleAnalytics);
