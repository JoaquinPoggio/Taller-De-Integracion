import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSesion } from "../useSesion.js";

const VALORES_INICIALES = {
  nombreUsuario: "",
  contacto: "",
  calle: "",
  numero: "",
  localidad: "",
  codigoPostal: "",
  provinciaId: "",
  referencia: "",
};

// Un campo del formulario con su etiqueta y su mensaje de error
function Campo({ etiqueta, nombre, valores, errores, onChange, ...resto }) {
  return (
    <label className="campo">
      <span>{etiqueta}</span>
      <input
        name={nombre}
        value={valores[nombre]}
        onChange={onChange}
        aria-invalid={Boolean(errores[nombre])}
        {...resto}
      />
      {errores[nombre] && <small className="campo-error">{errores[nombre]}</small>}
    </label>
  );
}

export default function CompletarPerfil() {
  const navigate = useNavigate();
  const { usuario, cargando } = useSesion();
  const [provincias, setProvincias] = useState([]);
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch("/api/provincias")
      .then((res) => res.json())
      .then((data) => setProvincias(data.provincias))
      .catch(() => setErrorGeneral("No se pudieron cargar las provincias."));
  }, []);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErrores({});
    setErrorGeneral("");

    try {
      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valores),
      });

      if (res.ok) {
        navigate("/?registro=ok");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data.errores) {
        setErrores(data.errores);
      } else {
        setErrorGeneral(data.error || "No pudimos guardar tus datos. Intentá de nuevo.");
      }
    } catch {
      setErrorGeneral("No se pudo conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) return null;
  if (!usuario) return <Navigate to="/registro" replace />;
  if (usuario.perfilCompleto) return <Navigate to="/" replace />;

  const comunes = { valores, errores, onChange: cambiar };

  return (
    <main className="contenedor contenedor-angosto">
      <h1>Completá tus datos</h1>
      <p>
        Hola, {usuario.nombre}. Necesitamos algunos datos más para que puedas
        comprar y recibir tus pedidos.
      </p>

      {errorGeneral && <p className="aviso aviso-error">{errorGeneral}</p>}

      <form className="formulario" onSubmit={enviar} noValidate>
        <Campo etiqueta="Nombre de usuario" nombre="nombreUsuario" maxLength={50} autoComplete="username" {...comunes} />
        <Campo etiqueta="Teléfono de contacto" nombre="contacto" maxLength={30} type="tel" autoComplete="tel" {...comunes} />

        <h2>Dirección de envío</h2>
        <Campo etiqueta="Calle" nombre="calle" maxLength={100} autoComplete="address-line1" {...comunes} />
        <Campo etiqueta="Número" nombre="numero" maxLength={10} {...comunes} />
        <Campo etiqueta="Piso, departamento o referencias (opcional)" nombre="referencia" maxLength={100} {...comunes} />
        <Campo etiqueta="Localidad" nombre="localidad" maxLength={100} autoComplete="address-level2" {...comunes} />
        <Campo etiqueta="Código postal" nombre="codigoPostal" maxLength={8} autoComplete="postal-code" {...comunes} />

        <label className="campo">
          <span>Provincia</span>
          <select
            name="provinciaId"
            value={valores.provinciaId}
            onChange={cambiar}
            aria-invalid={Boolean(errores.provinciaId)}
          >
            <option value="">Elegí una provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia.id} value={provincia.id}>
                {provincia.nombre}
              </option>
            ))}
          </select>
          {errores.provinciaId && <small className="campo-error">{errores.provinciaId}</small>}
        </label>

        <button className="boton-principal" type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : "Guardar y continuar"}
        </button>
      </form>
    </main>
  );
}
