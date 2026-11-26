require("dotenv").config();

const faltantes = [
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
].filter((nombre) => !process.env[nombre]);

if (faltantes.length > 0) {
  console.error(`Faltan variables en backend/.env: ${faltantes.join(", ")}`);
  process.exit(1);
}

const express = require("express");
const session = require("express-session");
const passport = require("./passport");
const prisma = require("./db");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "conectada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, db: "sin conexión" });
  }
});

app.use(authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, (error) => {
  if (error) {
    console.error(`No se pudo iniciar en el puerto ${PORT}: ${error.message}`);
    process.exit(1);
  }
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
