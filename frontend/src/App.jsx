import { Link, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx";
import Registro from "./pages/Registro.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/registro" element={<Registro />} />
      <Route
        path="*"
        element={
          <main className="contenedor">
            <h1>Página no encontrada</h1>
            <Link to="/">Volver al inicio</Link>
          </main>
        }
      />
    </Routes>
  );
}
