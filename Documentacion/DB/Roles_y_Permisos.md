## Definición de roles, usuarios y permisos

### 1. Invitado

- **Rol:** `rol_invitado`
- **Usuario asociado:** `usr_invitado`
- **Responsabilidad:** navegar el catálogo, filtrar y buscar productos, y ver promociones y reseñas sin necesidad de crear una cuenta.
- **Permisos previstos:**
  - `SELECT` sobre `Vista_Catalogo`, `Vista_Promociones_Vigentes` y `Vista_Resenas_Publicas`.
  - `SELECT` sobre `Categoria`, `Marca`, `Etiqueta`, `Imagen_Producto` y `Componente_Kit`.
- **Restricciones:** no tendrá permisos de `INSERT`, `UPDATE` ni `DELETE` sobre ninguna tabla. No accederá directamente a `Producto`, para no exponer el stock exacto: `Vista_Catalogo` solo informa si queda poca cantidad o si el producto está agotado. Tampoco accederá a `Usuario`, `Direccion`, `Pedido`, `Pago` ni a datos de otros usuarios. El registro no se hace con un `INSERT` directo: lo gestiona Supabase Auth y el trigger `tgr_usuario_crear_perfil`. El carrito del invitado se guarda en el navegador, no en la base de datos.

### 2. Cliente

- **Rol:** `rol_cliente`
- **Usuario asociado:** `usr_cliente`
- **Responsabilidad:** gestionar su perfil, direcciones y mascotas, guardar favoritos, armar el carrito, realizar y pagar compras, seguir y cancelar sus pedidos, y dejar reseñas de los productos recibidos.
- **Permisos previstos:**
  - `GRANT rol_invitado TO rol_cliente;` (hereda los permisos del invitado).
  - `SELECT` sobre `Usuario` y `UPDATE (nombre, nombre_usuario, contacto)` sobre `Usuario`.
  - `SELECT`, `INSERT`, `UPDATE` y `DELETE` sobre `Direccion`, `Mascota` e `Item_Carrito`.
  - `SELECT` e `INSERT` sobre `Carrito`.
  - `SELECT`, `INSERT` y `DELETE` sobre `Favorito` y `Aviso_Stock`.
  - `SELECT` sobre `Pedido`, `Item_Pedido`, `Pago` y `Provincia`.
  - `SELECT` e `INSERT` sobre `Resena`, y `UPDATE (puntuacion, comentario)` sobre `Resena`.
  - `SELECT` sobre `Vista_Configuracion_Publica` (contacto de WhatsApp).
  - Ejecución de `FN_Validar_Cupon`.
  - Ejecución de `SP_Crear_Pedido`.
  - Ejecución de `SP_Cancelar_Pedido`.
- **Restricciones:** solo accederá a sus propias filas, mediante políticas de seguridad por fila (`id_usuario = auth.uid()`). No podrá modificar su `rol` ni su `email`. No tendrá permisos de `DELETE` sobre `Pedido`, `Item_Pedido`, `Pago` ni `Resena`. No podrá modificar precios, stock ni promociones, ni acceder a `Movimiento_Stock`, `Cupon`, `Promocion` ni `Configuracion`. Los pedidos se crean y se cancelan únicamente mediante `SP_Crear_Pedido` y `SP_Cancelar_Pedido`, y la cancelación solo se permite dentro del plazo definido. Solo podrá editar reseñas que sigan publicadas.

### 3. Administrador

- **Rol:** `rol_administrador`
- **Usuario asociado:** `usr_administrador`
- **Responsabilidad:** gestionar el catálogo, el stock, los pedidos y sus envíos, los costos de envío por provincia, las promociones y los cupones, moderar reseñas, consultar las estadísticas de la tienda y mantener los parámetros del sistema.
- **Permisos previstos:**
  - `GRANT rol_cliente TO rol_administrador;` (hereda los permisos del cliente y, por su intermedio, los del invitado).
  - `SELECT`, `INSERT`, `UPDATE` y `DELETE` sobre `Producto`, `Imagen_Producto` y `Componente_Kit`.
  - `SELECT`, `INSERT` y `UPDATE` sobre `Categoria`, `Marca` y `Etiqueta`.
  - `SELECT` e `INSERT` sobre `Movimiento_Stock`.
  - `SELECT` sobre `Aviso_Stock`.
  - `SELECT` sobre todas las filas de `Usuario`, y `UPDATE (rol)` sobre `Usuario`.
  - `SELECT` sobre todas las filas de `Pedido`, `Item_Pedido` y `Pago`, y `UPDATE (estado)` sobre `Pedido`.
  - `UPDATE (costo_envio, activa)` sobre `Provincia`.
  - `SELECT`, `INSERT` y `UPDATE` sobre `Promocion` y `Cupon`.
  - `SELECT`, `INSERT` y `DELETE` sobre `Promocion_Producto`.
  - `SELECT` sobre todas las filas de `Resena`, y `UPDATE (estado, id_moderador, motivo_moderacion, fecha_moderacion)` sobre `Resena`.
  - `SELECT` y `UPDATE` sobre `Configuracion`.
  - `SELECT` sobre `Vista_Ventas_Mensuales`, `Vista_Productos_Mas_Vendidos` y `Vista_Stock_Bajo`.
- **Restricciones:** no tendrá permisos para modificar la estructura de la base de datos (`CREATE`, `ALTER`, `DROP`) ni para otorgar permisos (`GRANT`). No tendrá permisos de `DELETE` sobre `Pedido`, `Item_Pedido`, `Pago`, `Movimiento_Stock` ni `Resena`: las reseñas se moderan cambiando su estado a ELIMINADA, y el `DELETE` sobre `Producto` lo convierte en baja lógica el trigger `tgr_producto_baja_logica`. No podrá modificar `Pago`, que se actualiza desde la integración con Mercado Pago, ni los montos y datos de entrega de un `Pedido` (lo impide `tgr_pedido_datos_inmutables`). En su rol de cliente, solo accederá a su propio carrito, favoritos, direcciones y mascotas.

### Objetos de base de datos referenciados

Los permisos anteriores nombran objetos que hay que crear además de las tablas:

- **Vistas:**
  - `Vista_Catalogo`: productos activos con su precio, el precio con la promoción vigente y un indicador de disponibilidad que no muestra el stock exacto.
  - `Vista_Promociones_Vigentes`: promociones vigentes y destacadas con sus productos.
  - `Vista_Resenas_Publicas`: reseñas publicadas con el nombre de usuario del autor, sin datos personales.
  - `Vista_Configuracion_Publica`: parámetros que ve el cliente, como el contacto de WhatsApp.
  - `Vista_Ventas_Mensuales`: cantidad de ventas e ingresos por mes.
  - `Vista_Productos_Mas_Vendidos`: unidades vendidas por producto y por mes.
  - `Vista_Stock_Bajo`: productos activos cuyo stock está por debajo del umbral del administrador.
- **Funciones y procedimientos:**
  - `FN_Validar_Cupon`: verifica un código de cupón sin dar acceso a la lista de cupones.
  - `SP_Crear_Pedido`: crea el pedido y sus ítems en una sola operación.
  - `SP_Cancelar_Pedido`: cancela un pedido propio dentro del plazo permitido.

### Notas

- **Equivalencia con Supabase:** `rol_invitado` corresponde al rol `anon` (sin sesión) y `rol_cliente` al rol `authenticated` (con sesión iniciada).
- **Cuenta técnica del backend:** hay operaciones que ninguno de los tres roles puede hacer, como actualizar `Pago` o `Pedido` cuando Mercado Pago notifica el resultado. Las ejecuta el backend con su clave de servicio, que no es un rol de negocio. Por eso cada endpoint de administración debe comprobar que el usuario tenga rol ADMINISTRADOR.
- **Administración de la base:** la creación de tablas, vistas, triggers y migraciones queda fuera de estos tres roles y la realizan los integrantes del equipo con las credenciales del proyecto en Supabase.