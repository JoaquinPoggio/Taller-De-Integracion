require("dotenv").config();
const express = require("express");
const prisma = require("./db");

const app = express();
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "conectada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, db: "sin conexión" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, (error) => {
  if (error) {
    console.error(`No se pudo iniciar en el puerto ${PORT}: ${error.message}`);
    process.exit(1);
  }
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
