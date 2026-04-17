import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home/Home.jsx";
import Evento from "./pages/Evento/Evento .jsx";
import Reserva from "./pages/Reserva/Reserva.jsx";
import Fotos from "./pages/Fotos/Fotos.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
        <Route index element={<Home/>}/>
        <Route path="evento" element={<Evento/>}/>
        <Route path="reserva" element={<Reserva/>}/>
        <Route path="fotos" element={<Fotos/>}/>
        <Route path="*" element={<NotFound/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
