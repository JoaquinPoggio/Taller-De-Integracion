import { useCallback, useEffect, useState } from "react";

// Devuelve el usuario con sesión iniciada (o null) y una función para cerrar sesión.
export function useSesion() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUsuario(data.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  const cerrarSesion = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUsuario(null);
  }, []);

  return { usuario, cargando, cerrarSesion };
}
