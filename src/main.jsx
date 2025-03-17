import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Подключаем CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Если используем Bootstrap

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
