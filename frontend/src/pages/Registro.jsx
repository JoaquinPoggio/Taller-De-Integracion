import { Link, useSearchParams } from "react-router-dom";

const MENSAJES = {
  // A2: el usuario canceló la autorización en Google
  cancelado:
    "Cancelaste la autorización en Google, así que no se creó ninguna cuenta. Podés intentarlo de nuevo cuando quieras.",
  // A1: ya existe una cuenta con ese perfil o correo
  "cuenta-existente":
    "Ya existe una cuenta asociada a ese perfil de Google. Iniciá sesión en su lugar.",
  fallo: "No pudimos completar el registro con Google. Intentá de nuevo.",
};

export default function Registro() {
  const [params] = useSearchParams();
  const error = params.get("error");
  const mensaje =
    error && Object.hasOwn(MENSAJES, error) ? MENSAJES[error] : null;

  return (
    <main className="contenedor contenedor-angosto">
      <h1>Crear cuenta</h1>
      <p>
        Registrate con tu cuenta de Google para comprar, reseñar y guardar
        favoritos.
      </p>

      {mensaje && <p className="aviso aviso-error">{mensaje}</p>}

      {error === "cuenta-existente" && (
        <p>
          <Link to="/login">Iniciar sesión</Link>
        </p>
      )}

      {/* Es un enlace común (no un Link) porque tiene que salir de la app hacia el backend y Google */}
      <a className="boton-google" href="/auth/google/registro">
        Continuar con Google
      </a>

      <p>
        <Link to="/">Volver al inicio</Link>
      </p>
    </main>
  );
}
