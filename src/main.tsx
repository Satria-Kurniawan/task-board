import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TaskContextProvider } from "./context/Task/TaskContext.tsx";
import { AuthContextProvider } from "./context/Auth/AuthContext.tsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <TaskContextProvider>
        <Toaster />
        <App />
      </TaskContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
