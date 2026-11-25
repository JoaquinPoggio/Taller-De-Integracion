import { useEffect, useState } from "react";

export default function App() {
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
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>PetMarket Club</h1>
      <p>{estado}</p>
    </main>
  );
}
