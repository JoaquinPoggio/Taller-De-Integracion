const express = require("express");
const passport = require("../passport");
const prisma = require("../db");

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function publico(usuario) {
  const { id, nombre, correo, rol } = usuario;
  return { id, nombre, correo, rol };
}

// Pasos 1 a 3: el usuario elige Google y autoriza el acceso
router.get(
  "/auth/google/registro",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  }),
);

// Vuelta desde Google
router.get("/auth/google/registro/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, async (error, perfil) => {
    if (error) {
      console.error(error);
      return res.redirect(`${FRONTEND_URL}/registro?error=fallo`);
    }

    if (!perfil) {
      // A2: el usuario canceló la autorización en Google
      const motivo =
        req.query.error === "access_denied" ? "cancelado" : "fallo";
      return res.redirect(`${FRONTEND_URL}/registro?error=${motivo}`);
    }

    try {
      const correo = perfil.emails?.[0]?.value;
      if (!correo) {
        return res.redirect(`${FRONTEND_URL}/registro?error=fallo`);
      }

      const existente = await prisma.usuario.findFirst({
        where: {
          OR: [
            { proveedorRedSocial: "google", idRedSocial: perfil.id },
            { correo },
          ],
        },
      });

      if (existente) {
        // A1: ya existe una cuenta con ese perfil o correo
        return res.redirect(`${FRONTEND_URL}/registro?error=cuenta-existente`);
      }

      // Paso 4: recuperamos los datos básicos del perfil y creamos la cuenta
      const nuevo = await prisma.usuario.create({
        data: {
          nombre: perfil.displayName || correo.split("@")[0],
          correo,
          proveedorRedSocial: "google",
          idRedSocial: perfil.id,
        },
      });

      // Paso 6: inicio de sesión automático
      req.login(nuevo, (errorLogin) => {
        if (errorLogin) return next(errorLogin);
        res.redirect(`${FRONTEND_URL}/?registro=ok`);
      });
    } catch (e) {
      if (e.code === "P2002") {
        // Alguien creó la misma cuenta en simultáneo
        return res.redirect(`${FRONTEND_URL}/registro?error=cuenta-existente`);
      }
      next(e);
    }
  })(req, res, next);
});

// Sesión actual: sirve para saber si el usuario quedó autenticado
router.get("/api/auth/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ usuario: null });
  }
  res.json({ usuario: publico(req.user) });
});

router.post("/api/auth/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });
});

module.exports = router;
