import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@fontsource/montserrat/400.css"; // regular
import "@fontsource/montserrat/500.css"; // medium
import "@fontsource/montserrat/700.css"; // bold
import "@fontsource/montserrat/800.css"; // extra bold
import "./index.css"; // your global CSS file
import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </React.StrictMode>
);
