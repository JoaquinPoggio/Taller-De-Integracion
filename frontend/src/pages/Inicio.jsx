import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSesion } from "../useSesion.js";

export default function Inicio() {
  const [params] = useSearchParams();
  const { usuario, cargando, cerrarSesion } = useSesion();
  const [estado, setEstado] = useState("Consultando al backend...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) =>
        setEstado(
          data.ok
            ? "Backend y base de datos conectados"
            : "Backend sin conexión a la base de datos",
        ),
      )
      .catch(() => setEstado("No se pudo conectar con el backend"));
  }, []);

  return (
    <main className="contenedor">
      <header className="encabezado">
        <h1>PetMarket Club</h1>
        <nav>
          {!cargando &&
            (usuario ? (
              <>
                <span>Hola, {usuario.nombre}</span>
                <button type="button" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/registro">Registrarme</Link>
            ))}
        </nav>
      </header>

      {params.get("registro") === "ok" && usuario && (
        <p className="aviso aviso-ok">¡Cuenta creada! Ya iniciaste sesión.</p>
      )}

      <p className="estado">{estado}</p>
    </main>
  );
}
