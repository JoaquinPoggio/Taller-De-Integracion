import { Navigate } from "react-router-dom";
import { useSesion } from "../useSesion.js";

// Si el usuario tiene sesión pero todavía no completó sus datos, lo manda al formulario.
// A los invitados (sin sesión) los deja pasar.
export default function ExigirPerfil({ children }) {
  const { usuario, cargando } = useSesion();

  if (cargando) return null;

  if (usuario && !usuario.perfilCompleto) {
    return <Navigate to="/completar-perfil" replace />;
  }

  return children;
}
