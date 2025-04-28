import React from "react";
import ReactDOM from "react-dom/client"; // For React 18+
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import App from "./App"; // Your main App component
import "./index.css"; // Your global styles

// Create the root element for React 18
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App wrapped in Router to enable routing
root.render(
  <Router>
    <App />
  </Router>
);
