-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('CLIENTE', 'ADMINISTRADOR');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "proveedorRedSocial" TEXT NOT NULL,
    "idRedSocial" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'CLIENTE',
    "usuario" TEXT,
    "direccion" TEXT,
    "contacto" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_proveedorRedSocial_idRedSocial_key" ON "usuarios"("proveedorRedSocial", "idRedSocial");
