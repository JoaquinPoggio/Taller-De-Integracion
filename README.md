# PetMarket Club - Taller de Integración 2026 (Equipo D)

Tienda online de productos para mascotas.

**Stack:** Node + Express (backend), React con Vite (frontend), PostgreSQL con Prisma (base de datos), Docker Compose.

## Requisitos

- Git
- Docker Desktop (abierto)
- Node 20.19 o superior (`node -v` para verificar)

## Puertos que usa el proyecto

| Servicio   | Puerto |
| ---------- | ------ |
| PostgreSQL | 5433   |
| Backend    | 3001   |
| Frontend   | 5173   |

Si alguno está ocupado en tu computadora, el programa que lo usa tiene que cerrarse antes de arrancar el proyecto.

## Puesta en marcha

1. Clonar la rama `pruebas`:

   ```
   git clone -b pruebas https://github.com/JoaquinPoggio/Taller-De-Integracion.git
   cd Taller-De-Integracion
   ```

2. Levantar PostgreSQL (desde la raíz del repo):

   ```
   docker compose up -d
   ```

3. Backend (terminal 1):

   ```
   cd backend
   npm install
   copy .env.example .env
   npx prisma migrate dev
   npm run dev
   ```

   (En Linux o Mac usar `cp` en lugar de `copy`.)

   Tiene que decir `Backend escuchando en http://localhost:3001`.

4. Frontend (terminal 2):

   ```
   cd frontend
   npm install
   npm run dev
   ```

5. Abrir http://localhost:5173. Si dice "Backend y base de datos conectados", todo está bien.

## Estructura

- `backend/`: API en Express y modelo de datos (Prisma).
- `frontend/`: aplicación React.
- `docker-compose.yml`: base de datos PostgreSQL.

## Flujo de trabajo

- Cada historia de usuario va en su propia rama (por ejemplo `feature/cu2-hu1-registro-google`), creada desde `pruebas`.
- Nunca subir el archivo `.env` (cada una tiene el suyo, creado a partir de `.env.example`).
- Si se cambia el modelo de datos (`backend/prisma/schema.prisma`), subir también la carpeta `backend/prisma/migrations`.

## Problemas frecuentes

- **`P1000: Authentication failed` al migrar:** hay otra base de datos usando el puerto, o quedó un volumen viejo. Probar `docker compose down -v` y después `docker compose up -d` (esto borra los datos locales de la base).
- **`EADDRINUSE` al iniciar el backend:** el puerto 3001 está ocupado por otro programa. Se puede ver cuál con `netstat -ano | findstr :3001`.
- **El frontend dice "No se pudo conectar con el backend":** verificar que el backend esté corriendo y que http://localhost:3001/api/health responda `ok`.
