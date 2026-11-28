const express = require("express");
const prisma = require("../db");
const requiereSesion = require("../middleware/requiereSesion");

const router = express.Router();

// Devuelve el texto sin espacios en los bordes (o "" si no es un texto)
function texto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

// Valida los datos del formulario. Devuelve los errores por campo y los datos limpios.
function validar(body = {}) {
  const errores = {};

  const nombreUsuario = texto(body.nombreUsuario);
  if (!/^[A-Za-z0-9_]{3,50}$/.test(nombreUsuario)) {
    errores.nombreUsuario =
      "Entre 3 y 50 caracteres: letras, números y guion bajo.";
  }

  const contacto = texto(body.contacto);
  const digitos = contacto.replace(/\D/g, "");
  if (!/^[0-9+\-\s]{1,30}$/.test(contacto) || digitos.length < 8) {
    errores.contacto =
      "Ingresá un teléfono válido (solo números, espacios, + y -).";
  }

  const calle = texto(body.calle);
  if (calle.length < 1 || calle.length > 100) {
    errores.calle = "Ingresá la calle (hasta 100 caracteres).";
  }

  const numero = texto(body.numero);
  if (numero.length < 1 || numero.length > 10) {
    errores.numero = "Ingresá el número (hasta 10 caracteres).";
  }

  const localidad = texto(body.localidad);
  if (localidad.length < 1 || localidad.length > 100) {
    errores.localidad = "Ingresá la localidad (hasta 100 caracteres).";
  }

  const codigoPostal = texto(body.codigoPostal);
  if (!/^[A-Za-z0-9]{4,8}$/.test(codigoPostal)) {
    errores.codigoPostal = "Entre 4 y 8 letras o números.";
  }

  const referencia = texto(body.referencia);
  if (referencia.length > 100) {
    errores.referencia = "Hasta 100 caracteres.";
  }

  const provinciaId = Number(body.provinciaId);
  if (!Number.isInteger(provinciaId) || provinciaId < 1) {
    errores.provinciaId = "Elegí una provincia de la lista.";
  }

  return {
    errores,
    datos: {
      nombreUsuario,
      contacto,
      calle,
      numero,
      localidad,
      codigoPostal,
      referencia: referencia || null,
      provinciaId,
    },
  };
}

// Provincias a las que se envía: alimentan el desplegable del formulario
router.get("/api/provincias", async (req, res) => {
  const provincias = await prisma.provincia.findMany({
    where: { activa: true },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
  res.json({ provincias });
});

// CU2 HU2: el usuario completa su nombre de usuario, su teléfono y su dirección principal
router.put("/api/perfil", requiereSesion, async (req, res) => {
  const { errores, datos } = validar(req.body);
  if (Object.keys(errores).length > 0) {
    return res.status(400).json({ errores });
  }

  const provincia = await prisma.provincia.findFirst({
    where: { id: datos.provinciaId, activa: true },
  });
  if (!provincia) {
    return res
      .status(400)
      .json({ errores: { provinciaId: "Elegí una provincia de la lista." } });
  }

  const direccion = {
    provinciaId: datos.provinciaId,
    calle: datos.calle,
    numero: datos.numero,
    localidad: datos.localidad,
    codigoPostal: datos.codigoPostal.toUpperCase(),
    referencia: datos.referencia,
  };

  try {
    // Todo o nada: si falla una parte, no se guarda ninguna
    await prisma.$transaction(async (tx) => {
      await tx.usuario.update({
        where: { id: req.user.id },
        data: { usuario: datos.nombreUsuario, contacto: datos.contacto },
      });

      const principal = await tx.direccion.findFirst({
        where: { usuarioId: req.user.id, esPrincipal: true },
      });

      if (principal) {
        await tx.direccion.update({ where: { id: principal.id }, data: direccion });
      } else {
        await tx.direccion.create({
          data: { ...direccion, usuarioId: req.user.id, esPrincipal: true },
        });
      }
    });
  } catch (error) {
    if (error.code === "P2002") {
      // El nombre de usuario ya lo tiene otra cuenta
      return res.status(409).json({
        errores: { nombreUsuario: "Ese nombre de usuario ya está en uso." },
      });
    }
    throw error;
  }

  res.json({ ok: true });
});

module.exports = router;
