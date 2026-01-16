import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//Importamos un css de bootstrap de los que hemos instalado
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
