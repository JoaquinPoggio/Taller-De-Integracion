# Diccionario de datos: PetMarket Club

**Convenciones**

- En la columna *Restricciones*, **NULL permitido** indica que el atributo es opcional. Si no figura, el atributo es obligatorio (NOT NULL).
- Las claves primarias compuestas marcan con `X` todos los atributos que las forman.
- Los valores de fecha y hora usan el dominio `DateTime`.
- Los atributos de tipo enumerado se guardan como `VARCHAR` y su rango lista los valores permitidos.

**Tablas incluidas (23):** Provincia, Usuario, Direccion, Mascota, Categoria, Marca, Etiqueta, Producto, Imagen_Producto, Componente_Kit, Cupon, Promocion, Promocion_Producto, Pedido, Item_Pedido, Pago, Movimiento_Stock, Aviso_Stock, Carrito, Item_Carrito, Favorito, Resena, Configuracion.

---

## Provincia

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_provincia` | Identificador de la provincia | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `nombre` | Nombre de la provincia o jurisdicción de destino | VARCHAR(50) | - | UNIQUE, NOT NULL | - | - | - |
| `costo_envio` | Costo de envío a esa provincia, definido por el administrador | Decimal(10,2) | >= 0 | NOT NULL | - | - | - |
| `activa` | Indica si se realizan envíos a esa provincia | Boolean | TRUE, FALSE | NOT NULL | TRUE | - | - |

**Restricciones CHECK**

- `CHECK (costo_envio >= 0)`
- `CHECK (length(trim(nombre)) > 0)`

**Triggers asociados**

No requiere.

**Datos iniciales:** las 24 jurisdicciones del país (23 provincias y la Ciudad Autónoma de Buenos Aires).

---

## Usuario

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_usuario` | Identificador del usuario, igual al de su cuenta en Supabase Auth | UUID | - | UNIQUE, NOT NULL | - | X | X (`auth.users`, de Supabase Auth) |
| `nombre` | Nombre completo, tomado del perfil de la red social | VARCHAR(100) | - | NOT NULL | - | - | - |
| `nombre_usuario` | Nombre de usuario elegido al completar el perfil | VARCHAR(50) | 3 a 50 caracteres | UNIQUE, NULL permitido | - | - | - |
| `email` | Correo electrónico, tomado de la red social | VARCHAR(100) | Formato de correo válido | UNIQUE, NOT NULL | - | - | - |
| `contacto` | Teléfono de contacto | VARCHAR(30) | Solo dígitos, espacios, `+` y `-` | NULL permitido | - | - | - |
| `rol` | Rol del usuario en el sistema | VARCHAR(20) | CLIENTE, ADMINISTRADOR | NOT NULL | CLIENTE | - | - |
| `fecha_registro` | Fecha y hora en que se creó la cuenta | DateTime | <= fecha actual | NOT NULL | CURRENT_TIMESTAMP | - | - |

`nombre_usuario` y `contacto` son opcionales porque se completan después del primer inicio de sesión, y deben estar cargados antes de realizar una compra.

**Restricciones CHECK**

- `CHECK (rol IN ('CLIENTE', 'ADMINISTRADOR'))`
- `CHECK (email LIKE '%_@_%._%')`
- `CHECK (nombre_usuario IS NULL OR length(nombre_usuario) >= 3)`
- `CHECK (fecha_registro <= CURRENT_TIMESTAMP)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_usuario_crear_perfil` | Crea el perfil con rol CLIENTE cuando se registra una cuenta nueva en Supabase Auth (tabla `auth.users`) | INSERT (en `auth.users`) |
| `tgr_usuario_rol_protegido` | Impide que un usuario cambie su propio rol; solo un administrador puede modificar el rol de otro usuario | UPDATE |

---

## Direccion

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_direccion` | Identificador de la dirección | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_usuario` | Usuario al que pertenece la dirección | UUID | - | NOT NULL | - | - | X (`Usuario`) |
| `id_provincia` | Provincia de la dirección | Int | - | NOT NULL | - | - | X (`Provincia`) |
| `alias` | Nombre con el que el usuario identifica la dirección (ej. "Casa") | VARCHAR(50) | - | NULL permitido | - | - | - |
| `calle` | Calle de la dirección | VARCHAR(100) | - | NOT NULL | - | - | - |
| `numero` | Número de la dirección | VARCHAR(10) | - | NOT NULL | - | - | - |
| `localidad` | Localidad de la dirección | VARCHAR(100) | - | NOT NULL | - | - | - |
| `codigo_postal` | Código postal | VARCHAR(10) | 4 a 8 caracteres alfanuméricos | NOT NULL | - | - | - |
| `referencia` | Datos adicionales: piso, departamento, entre calles | VARCHAR(100) | - | NULL permitido | - | - | - |
| `es_principal` | Indica si es la dirección predeterminada del usuario | Boolean | TRUE, FALSE | NOT NULL | FALSE | - | - |

**Restricciones CHECK**

- `CHECK (length(trim(calle)) > 0 AND length(trim(numero)) > 0 AND length(trim(localidad)) > 0)`
- `CHECK (length(codigo_postal) BETWEEN 4 AND 8)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_direccion_principal_unica` | Garantiza una sola dirección principal por usuario: al marcar una como principal desmarca las demás, y marca como principal la primera dirección que carga el usuario | INSERT, UPDATE |

---

## Mascota

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_mascota` | Identificador de la mascota | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_usuario` | Cliente dueño de la mascota | UUID | - | NOT NULL | - | - | X (`Usuario`) |
| `nombre` | Nombre de la mascota | VARCHAR(50) | - | NOT NULL | - | - | - |
| `animal` | Tipo de animal | VARCHAR(10) | PERRO, GATO, AVE | NOT NULL | - | - | - |
| `tamano` | Tamaño de la mascota | VARCHAR(10) | PEQUENO, MEDIANO, GRANDE | NOT NULL | - | - | - |
| `etapa_vida` | Etapa de vida de la mascota | VARCHAR(10) | CACHORRO, ADULTO | NOT NULL | - | - | - |

**Restricciones CHECK**

- `CHECK (animal IN ('PERRO', 'GATO', 'AVE'))`
- `CHECK (tamano IN ('PEQUENO', 'MEDIANO', 'GRANDE'))`
- `CHECK (etapa_vida IN ('CACHORRO', 'ADULTO'))`
- `CHECK (length(trim(nombre)) > 0)`

**Triggers asociados**

No requiere.

---

## Categoria

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_categoria` | Identificador de la categoría | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `nombre` | Nombre de la categoría | VARCHAR(50) | - | UNIQUE, NOT NULL | - | - | - |

**Restricciones CHECK**

- `CHECK (length(trim(nombre)) > 0)`

**Triggers asociados**

No requiere.

**Datos iniciales:** Alimento, Higiene y cuidado, Accesorios.

---

## Marca

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_marca` | Identificador de la marca | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `nombre` | Nombre de la marca, seleccionable en un desplegable al cargar un producto | VARCHAR(50) | - | UNIQUE (sin distinguir mayúsculas), NOT NULL | - | - | - |

**Restricciones CHECK**

- `CHECK (length(trim(nombre)) > 0)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_marca_normalizar_nombre` | Elimina los espacios sobrantes del nombre y rechaza marcas que solo difieran en mayúsculas o minúsculas de una existente, para evitar duplicados en el filtro por marca | INSERT, UPDATE |

---

## Etiqueta

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_etiqueta` | Identificador de la etiqueta "se recomienda para" | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `nombre` | Texto que se muestra al cliente (ej. "Para adultos") | VARCHAR(50) | - | UNIQUE, NOT NULL | - | - | - |
| `etapa_vida` | Etapa de vida a la que apunta la etiqueta (nulo significa cualquiera) | VARCHAR(10) | CACHORRO, ADULTO | NULL permitido | - | - | - |
| `tamano` | Tamaño de mascota al que apunta la etiqueta (nulo significa cualquiera) | VARCHAR(10) | PEQUENO, MEDIANO, GRANDE | NULL permitido | - | - | - |

**Restricciones CHECK**

- `CHECK (etapa_vida IS NULL OR etapa_vida IN ('CACHORRO', 'ADULTO'))`
- `CHECK (tamano IS NULL OR tamano IN ('PEQUENO', 'MEDIANO', 'GRANDE'))`
- `CHECK (length(trim(nombre)) > 0)`

**Triggers asociados**

No requiere.

---

## Producto

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_producto` | Identificador del producto o kit | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_categoria` | Categoría del producto | Int | - | NOT NULL | - | - | X (`Categoria`) |
| `id_marca` | Marca del producto (los kits no tienen) | Int | - | NULL permitido | - | - | X (`Marca`) |
| `id_etiqueta` | Etiqueta "se recomienda para" (una sola por producto) | Int | - | NULL permitido | - | - | X (`Etiqueta`) |
| `nombre` | Nombre del producto | VARCHAR(100) | - | NOT NULL | - | - | - |
| `descripcion` | Descripción completa del producto | VARCHAR(500) | - | NOT NULL | - | - | - |
| `precio` | Precio de venta en pesos argentinos | Decimal(10,2) | > 0 | NOT NULL | - | - | - |
| `stock_actual` | Unidades disponibles. En los kits no se usa: se calcula con los componentes | Int | >= 0 | NOT NULL | 0 | - | - |
| `activo` | Indica si el producto está visible en el catálogo (baja lógica) | Boolean | TRUE, FALSE | NOT NULL | TRUE | - | - |
| `es_kit` | Indica si el producto es un kit o combo | Boolean | TRUE, FALSE | NOT NULL | FALSE | - | - |
| `animal` | Tipo de animal al que va dirigido (nulo significa apto para todos) | VARCHAR(10) | PERRO, GATO, AVE | NULL permitido | - | - | - |
| `talle` | Talle del producto, para arneses, ropa y camas | VARCHAR(2) | S, M, L, XL | NULL permitido | - | - | - |
| `peso_gramos` | Peso del producto en gramos | Int | > 0 | NULL permitido | - | - | - |
| `fecha_alta` | Fecha y hora de carga del producto | DateTime | <= fecha actual | NOT NULL | CURRENT_TIMESTAMP | - | - |

**Restricciones CHECK**

- `CHECK (precio > 0)`
- `CHECK (stock_actual >= 0)`
- `CHECK (peso_gramos IS NULL OR peso_gramos > 0)`
- `CHECK (animal IS NULL OR animal IN ('PERRO', 'GATO', 'AVE'))`
- `CHECK (talle IS NULL OR talle IN ('S', 'M', 'L', 'XL'))`
- `CHECK (length(trim(nombre)) > 0 AND length(trim(descripcion)) > 0)`
- `CHECK (NOT es_kit OR stock_actual = 0)` (un kit no tiene stock propio)

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_producto_baja_logica` | Reemplaza el borrado físico por `activo = FALSE`, para conservar el producto en el historial de pedidos | DELETE |
| `tgr_producto_kit_activacion` | Al activar un kit verifica que tenga al menos 2 componentes y que todos estén activos | INSERT, UPDATE |

---

## Imagen_Producto

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_imagen` | Identificador de la imagen | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_producto` | Producto al que pertenece la imagen | Int | - | NOT NULL | - | - | X (`Producto`) |
| `url` | Dirección de la imagen en el almacenamiento | VARCHAR(255) | Empieza con `http` | NOT NULL | - | - | - |
| `descripcion` | Texto alternativo de la imagen | VARCHAR(100) | - | NULL permitido | - | - | - |
| `es_principal` | Indica si es la imagen que se muestra en listados y estadísticas | Boolean | TRUE, FALSE | NOT NULL | FALSE | - | - |
| `orden` | Posición de la imagen en la galería del producto | Int | >= 1 | NOT NULL | 1 | - | - |

**Restricciones CHECK**

- `CHECK (url LIKE 'http%')`
- `CHECK (orden >= 1)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_imagen_principal_unica` | Garantiza una sola imagen principal por producto: la primera imagen cargada queda como principal, y si se borra la principal se promueve la siguiente | INSERT, UPDATE, DELETE |

---

## Componente_Kit

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_kit` | Producto que es el kit | Int | - | NOT NULL | - | X | X (`Producto`) |
| `id_componente` | Producto que forma parte del kit | Int | - | NOT NULL | - | X | X (`Producto`) |
| `cantidad` | Unidades del componente que incluye el kit | Int | >= 1 | NOT NULL | 1 | - | - |

**Restricciones CHECK**

- `CHECK (cantidad >= 1)`
- `CHECK (id_kit <> id_componente)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_componente_kit_valido` | Verifica que `id_kit` sea un producto con `es_kit = TRUE` y que `id_componente` tenga `es_kit = FALSE`, para que un kit no contenga otro kit | INSERT, UPDATE |

---

## Cupon

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_cupon` | Identificador del cupón | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `codigo` | Código que el cliente ingresa al comprar | VARCHAR(30) | Mayúsculas, sin espacios | UNIQUE, NOT NULL | - | - | - |
| `tipo_descuento` | Forma en que se aplica el descuento | VARCHAR(15) | PORCENTAJE, MONTO_FIJO | NOT NULL | PORCENTAJE | - | - |
| `valor` | Porcentaje o monto del descuento, según el tipo | Decimal(10,2) | > 0. Si es PORCENTAJE, <= 100 | NOT NULL | - | - | - |
| `fecha_inicio` | Inicio de la vigencia | DateTime | - | NOT NULL | - | - | - |
| `fecha_fin` | Fin de la vigencia | DateTime | > `fecha_inicio` | NOT NULL | - | - | - |
| `activo` | Indica si el cupón está habilitado | Boolean | TRUE, FALSE | NOT NULL | TRUE | - | - |

**Restricciones CHECK**

- `CHECK (tipo_descuento IN ('PORCENTAJE', 'MONTO_FIJO'))`
- `CHECK (valor > 0)`
- `CHECK (tipo_descuento <> 'PORCENTAJE' OR valor <= 100)`
- `CHECK (fecha_fin > fecha_inicio)`
- `CHECK (codigo = upper(codigo) AND codigo NOT LIKE '% %')`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_cupon_normalizar_codigo` | Convierte el código a mayúsculas y elimina los espacios, para que el cliente pueda escribirlo de cualquier forma | INSERT, UPDATE |

---

## Promocion

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_promocion` | Identificador de la promoción u oferta | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `nombre` | Nombre de la promoción | VARCHAR(100) | - | NULL permitido | - | - | - |
| `descripcion` | Descripción de la promoción | VARCHAR(255) | - | NULL permitido | - | - | - |
| `tipo_descuento` | Forma en que se aplica el descuento | VARCHAR(15) | PORCENTAJE, MONTO_FIJO | NOT NULL | PORCENTAJE | - | - |
| `valor` | Porcentaje o monto del descuento, según el tipo | Decimal(10,2) | > 0. Si es PORCENTAJE, <= 100 | NOT NULL | - | - | - |
| `fecha_inicio` | Inicio de la vigencia | DateTime | - | NOT NULL | - | - | - |
| `fecha_fin` | Fin de la vigencia | DateTime | > `fecha_inicio` | NOT NULL | - | - | - |
| `activa` | Indica si la promoción está habilitada | Boolean | TRUE, FALSE | NOT NULL | TRUE | - | - |
| `destacada` | Indica si se muestra en la página principal | Boolean | TRUE, FALSE | NOT NULL | FALSE | - | - |

Una promoción está vigente cuando `activa` es verdadera y la fecha actual está entre `fecha_inicio` y `fecha_fin`.

**Restricciones CHECK**

- `CHECK (tipo_descuento IN ('PORCENTAJE', 'MONTO_FIJO'))`
- `CHECK (valor > 0)`
- `CHECK (tipo_descuento <> 'PORCENTAJE' OR valor <= 100)`
- `CHECK (fecha_fin > fecha_inicio)`

**Triggers asociados**

No requiere.

---

## Promocion_Producto

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_promocion` | Promoción aplicada | Int | - | NOT NULL | - | X | X (`Promocion`) |
| `id_producto` | Producto incluido en la promoción | Int | - | NOT NULL | - | X | X (`Producto`) |

**Restricciones CHECK**

No requiere.

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_promocion_producto_descuento_valido` | Si la promoción es de tipo MONTO_FIJO, verifica que su valor sea menor al precio del producto, para que el precio con descuento nunca sea cero o negativo | INSERT, UPDATE |

---

## Pedido

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_pedido` | Identificador del pedido | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_usuario` | Cliente que realizó el pedido | UUID | - | NOT NULL | - | - | X (`Usuario`) |
| `id_provincia` | Provincia de destino, de la que sale el costo de envío | Int | - | NOT NULL | - | - | X (`Provincia`) |
| `id_cupon` | Cupón aplicado a la compra | Int | - | NULL permitido | - | - | X (`Cupon`) |
| `fecha` | Fecha y hora en que se generó el pedido | DateTime | <= fecha actual | NOT NULL | CURRENT_TIMESTAMP | - | - |
| `estado` | Estado del pedido y de su envío | VARCHAR(15) | PENDIENTE_PAGO, EN_ESPERA, PREPARADO, ENVIADO, ENTREGADO, CANCELADO | NOT NULL | PENDIENTE_PAGO | - | - |
| `subtotal` | Suma de los precios de los ítems | Decimal(10,2) | >= 0 | NOT NULL | - | - | - |
| `descuento_total` | Descuento aplicado por el cupón | Decimal(10,2) | >= 0 y <= `subtotal` | NOT NULL | 0 | - | - |
| `costo_envio` | Costo de envío cobrado, copiado de la provincia al comprar | Decimal(10,2) | >= 0 | NOT NULL | - | - | - |
| `total` | Monto total a pagar | Decimal(10,2) | >= 0 | NOT NULL | - | - | - |
| `fecha_limite_cancelacion` | Fecha y hora hasta la que el cliente puede cancelar el pedido | DateTime | > `fecha` | NOT NULL | - | - | - |
| `nombre_destinatario` | Nombre de quien recibe el pedido, copiado al comprar | VARCHAR(100) | - | NOT NULL | - | - | - |
| `telefono_contacto` | Teléfono de contacto para la entrega, copiado al comprar | VARCHAR(30) | - | NOT NULL | - | - | - |
| `direccion_entrega` | Calle, número y referencia de la entrega, copiados al comprar | VARCHAR(200) | - | NOT NULL | - | - | - |
| `localidad_entrega` | Localidad de la entrega, copiada al comprar | VARCHAR(100) | - | NOT NULL | - | - | - |
| `codigo_postal_entrega` | Código postal de la entrega, copiado al comprar | VARCHAR(10) | 4 a 8 caracteres | NOT NULL | - | - | - |

**Restricciones CHECK**

- `CHECK (estado IN ('PENDIENTE_PAGO', 'EN_ESPERA', 'PREPARADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'))`
- `CHECK (subtotal >= 0 AND descuento_total >= 0 AND costo_envio >= 0 AND total >= 0)`
- `CHECK (descuento_total <= subtotal)`
- `CHECK (total = subtotal - descuento_total + costo_envio)`
- `CHECK (fecha_limite_cancelacion > fecha)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_pedido_envio_y_plazo` | Verifica que la provincia tenga los envíos activos, copia `costo_envio` desde `Provincia` y calcula `fecha_limite_cancelacion` con el plazo de `Configuracion` | INSERT |
| `tgr_pedido_transicion_estado` | Valida los cambios de estado: sigue el orden PENDIENTE_PAGO, EN_ESPERA, PREPARADO, ENVIADO, ENTREGADO, permite corregir hacia atrás, no permite modificar un pedido CANCELADO y solo permite cancelar antes de `fecha_limite_cancelacion` | UPDATE |
| `tgr_pedido_cancelacion_stock` | Al pasar a CANCELADO, repone el stock de los productos mediante movimientos de tipo CANCELACION | UPDATE |
| `tgr_pedido_datos_inmutables` | Impide modificar los montos, la provincia y los datos de entrega una vez creado el pedido | UPDATE |

---

## Item_Pedido

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_item_pedido` | Identificador del ítem | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_pedido` | Pedido al que pertenece el ítem | Int | - | NOT NULL | - | - | X (`Pedido`) |
| `id_producto` | Producto comprado | Int | - | NOT NULL | - | - | X (`Producto`) |
| `id_promocion` | Promoción aplicada al producto en esta compra | Int | - | NULL permitido | - | - | X (`Promocion`) |
| `cantidad` | Unidades compradas | Int | >= 1 | NOT NULL | 1 | - | - |
| `nombre_producto` | Nombre del producto al momento de comprar | VARCHAR(100) | - | NOT NULL | - | - | - |
| `precio_original` | Precio del producto sin promoción al momento de comprar | Decimal(10,2) | > 0 | NOT NULL | - | - | - |
| `precio_unitario` | Precio pagado por unidad, con la promoción aplicada | Decimal(10,2) | > 0 y <= `precio_original` | NOT NULL | - | - | - |

**Restricciones CHECK**

- `CHECK (cantidad >= 1)`
- `CHECK (precio_original > 0 AND precio_unitario > 0)`
- `CHECK (precio_unitario <= precio_original)`
- `CHECK (id_promocion IS NOT NULL OR precio_unitario = precio_original)`

**Otras restricciones**

- `UNIQUE (id_pedido, id_producto)`: un mismo producto aparece una sola vez por pedido.

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_item_pedido_copiar_datos` | Copia `nombre_producto` y `precio_original` desde `Producto`, calcula `precio_unitario` según la promoción vigente y recalcula el `subtotal` y el `total` del pedido | INSERT |
| `tgr_item_pedido_validar_stock` | Verifica que el producto esté activo y que haya stock suficiente (en un kit, de cada componente) | INSERT |
| `tgr_item_pedido_inmutable` | Impide modificar o eliminar ítems cuando el pedido ya salió del estado PENDIENTE_PAGO | UPDATE, DELETE |

---

## Pago

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_pago` | Identificador del intento de pago | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_pedido` | Pedido que se está pagando | Int | - | NOT NULL | - | - | X (`Pedido`) |
| `id_preferencia_mp` | Identificador de la preferencia de pago creada en Mercado Pago | VARCHAR(100) | - | NOT NULL | - | - | - |
| `id_pago_mp` | Identificador del pago en Mercado Pago, que llega con la notificación | VARCHAR(100) | - | UNIQUE, NULL permitido | - | - | - |
| `monto` | Monto del pago | Decimal(10,2) | > 0 | NOT NULL | - | - | - |
| `fecha` | Fecha y hora del intento de pago | DateTime | <= fecha actual | NOT NULL | CURRENT_TIMESTAMP | - | - |
| `estado` | Estado del pago | VARCHAR(15) | PENDIENTE, APROBADO, RECHAZADO, CANCELADO | NOT NULL | PENDIENTE | - | - |

Un pedido puede tener varios pagos, por ejemplo cuando el cliente reintenta tras un rechazo.

**Restricciones CHECK**

- `CHECK (monto > 0)`
- `CHECK (estado IN ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'CANCELADO'))`
- `CHECK (estado <> 'APROBADO' OR id_pago_mp IS NOT NULL)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_pago_monto_coincide` | Verifica que `monto` sea igual al `total` del pedido | INSERT |
| `tgr_pago_un_solo_aprobado` | Impide que un pedido tenga más de un pago APROBADO | INSERT, UPDATE |
| `tgr_pago_aprobado_confirma_pedido` | Al aprobarse el pago, pasa el pedido de PENDIENTE_PAGO a EN_ESPERA, descuenta el stock mediante movimientos de tipo VENTA y vacía el carrito del cliente | UPDATE |

---

## Movimiento_Stock

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_movimiento` | Identificador del movimiento | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_producto` | Producto cuyo stock se modifica | Int | - | NOT NULL | - | - | X (`Producto`) |
| `id_usuario` | Administrador que registró el movimiento (nulo en los automáticos) | UUID | - | NULL permitido | - | - | X (`Usuario`) |
| `id_pedido` | Pedido que originó el movimiento (en ventas y cancelaciones) | Int | - | NULL permitido | - | - | X (`Pedido`) |
| `tipo` | Tipo de movimiento | VARCHAR(15) | INGRESO, VENTA, EXTRACCION, CANCELACION | NOT NULL | - | - | - |
| `cantidad` | Unidades del movimiento | Int | >= 1 | NOT NULL | - | - | - |
| `motivo` | Motivo del movimiento (vencido, no apto, compra a proveedor) | VARCHAR(200) | - | NULL permitido | - | - | - |
| `fecha` | Fecha y hora del movimiento | DateTime | <= fecha actual | NOT NULL | CURRENT_TIMESTAMP | - | - |

**Restricciones CHECK**

- `CHECK (tipo IN ('INGRESO', 'VENTA', 'EXTRACCION', 'CANCELACION'))`
- `CHECK (cantidad >= 1)`
- `CHECK (tipo NOT IN ('VENTA', 'CANCELACION') OR id_pedido IS NOT NULL)`
- `CHECK (tipo NOT IN ('INGRESO', 'EXTRACCION') OR id_usuario IS NOT NULL)`
- `CHECK (tipo <> 'EXTRACCION' OR motivo IS NOT NULL)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_movimiento_stock_actualizar` | Actualiza `Producto.stock_actual`: suma los INGRESO y CANCELACION y resta los VENTA y EXTRACCION. Rechaza el movimiento si el stock quedaría negativo o si el producto es un kit (en un kit se mueve el stock de sus componentes) | INSERT |
| `tgr_movimiento_stock_inmutable` | Impide modificar o eliminar movimientos, para conservar el historial | UPDATE, DELETE |

---

## Aviso_Stock

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_aviso` | Identificador del aviso | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_usuario` | Cliente que pidió ser avisado | UUID | - | NOT NULL | - | - | X (`Usuario`) |
| `id_producto` | Producto agotado sobre el que se pidió el aviso | Int | - | NOT NULL | - | - | X (`Producto`) |
| `fecha_solicitud` | Fecha y hora en que se pidió el aviso | DateTime | <= fecha actual | NOT NULL | CURRENT_TIMESTAMP | - | - |
| `notificado` | Indica si ya se avisó al cliente de que el producto volvió a tener stock | Boolean | TRUE, FALSE | NOT NULL | FALSE | - | - |

**Restricciones CHECK**

No requiere.

**Otras restricciones**

- `UNIQUE (id_usuario, id_producto) WHERE notificado = FALSE`: un cliente tiene un solo aviso pendiente por producto.

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_aviso_stock_producto_agotado` | Solo permite solicitar el aviso si el producto tiene `stock_actual = 0` | INSERT |

---

## Carrito

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_carrito` | Identificador del carrito | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_usuario` | Cliente dueño del carrito | UUID | - | UNIQUE, NOT NULL | - | - | X (`Usuario`) |
| `fecha_creacion` | Fecha y hora de creación del carrito | DateTime | <= fecha actual | NOT NULL | CURRENT_TIMESTAMP | - | - |

Cada cliente tiene un solo carrito. El carrito del invitado se guarda en el navegador y se incorpora a esta tabla cuando inicia sesión.

**Restricciones CHECK**

No requiere.

**Triggers asociados**

No requiere.

---

## Item_Carrito

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_carrito` | Carrito al que pertenece el ítem | Int | - | NOT NULL | - | X | X (`Carrito`) |
| `id_producto` | Producto agregado al carrito | Int | - | NOT NULL | - | X | X (`Producto`) |
| `cantidad` | Unidades del producto en el carrito | Int | >= 1 | NOT NULL | 1 | - | - |

**Restricciones CHECK**

- `CHECK (cantidad >= 1)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_item_carrito_validar_stock` | Verifica que el producto esté activo y que `cantidad` no supere el stock disponible (en un kit, el de su componente más limitante) | INSERT, UPDATE |

---

## Favorito

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_usuario` | Cliente que guardó el favorito | UUID | - | NOT NULL | - | X | X (`Usuario`) |
| `id_producto` | Producto guardado como favorito | Int | - | NOT NULL | - | X | X (`Producto`) |
| `fecha_agregado` | Fecha y hora en que se agregó a favoritos | DateTime | <= fecha actual | NOT NULL | CURRENT_TIMESTAMP | - | - |

**Restricciones CHECK**

No requiere.

**Triggers asociados**

No requiere.

---

## Resena

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `id_resena` | Identificador de la reseña | Int | >= 1 | UNIQUE, NOT NULL | - | X | - |
| `id_item_pedido` | Ítem comprado que respalda la reseña (de él se obtienen el cliente y el producto) | Int | - | UNIQUE, NOT NULL | - | - | X (`Item_Pedido`) |
| `id_moderador` | Administrador que eliminó la reseña | UUID | - | NULL permitido | - | - | X (`Usuario`) |
| `puntuacion` | Puntuación otorgada al producto | Int | 1 a 5 | NOT NULL | - | - | - |
| `comentario` | Comentario del cliente | VARCHAR(500) | - | NULL permitido | - | - | - |
| `fecha` | Fecha y hora de publicación | DateTime | <= fecha actual | NOT NULL | CURRENT_TIMESTAMP | - | - |
| `estado` | Estado de la reseña | VARCHAR(15) | PUBLICADA, ELIMINADA | NOT NULL | PUBLICADA | - | - |
| `motivo_moderacion` | Motivo por el que el administrador la eliminó | VARCHAR(200) | - | NULL permitido | - | - | - |
| `fecha_moderacion` | Fecha y hora de la moderación | DateTime | >= `fecha` | NULL permitido | - | - | - |

**Restricciones CHECK**

- `CHECK (puntuacion BETWEEN 1 AND 5)`
- `CHECK (estado IN ('PUBLICADA', 'ELIMINADA'))`
- `CHECK (comentario IS NULL OR length(trim(comentario)) > 0)`
- `CHECK (estado <> 'ELIMINADA' OR (id_moderador IS NOT NULL AND fecha_moderacion IS NOT NULL))`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_resena_pedido_entregado` | Verifica que el pedido del ítem esté en estado ENTREGADO, para que solo se pueda reseñar un producto ya recibido | INSERT |
| `tgr_resena_moderador_admin` | Verifica que `id_moderador` corresponda a un usuario con rol ADMINISTRADOR y completa `fecha_moderacion` al eliminar la reseña | UPDATE |

---

## Configuracion

| Atributo | Descripción | Dominio | Rango | Restricciones | Valor por defecto | PK | FK (tabla referida) |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `clave` | Nombre del parámetro configurable | VARCHAR(50) | Minúsculas y guiones bajos | UNIQUE, NOT NULL | - | X | - |
| `valor` | Valor del parámetro, guardado como texto | VARCHAR(255) | - | NOT NULL | - | - | - |

**Datos iniciales**

- `plazo_cancelacion_horas`: horas posteriores a la compra en las que el cliente puede cancelar el pedido.
- `umbral_stock_cliente`: stock a partir del cual se le muestra al cliente "Queda el último" o "Quedan pocas unidades".
- `umbral_stock_admin`: stock a partir del cual el producto aparece en "Revisar stock" del panel del administrador.
- `whatsapp_contacto`: número de WhatsApp para reclamos y consultas.

**Restricciones CHECK**

- `CHECK (clave = lower(clave) AND clave NOT LIKE '% %')`
- `CHECK (length(trim(valor)) > 0)`

**Triggers asociados**

| Trigger | Descripción | Operaciones vinculadas |
| :--- | :--- | :--- |
| `tgr_configuracion_valor_valido` | Verifica que `plazo_cancelacion_horas`, `umbral_stock_cliente` y `umbral_stock_admin` sean números enteros positivos | INSERT, UPDATE |

---

## Resumen de triggers

- **Usuario:** 2
- **Direccion:** 1
- **Marca:** 1
- **Producto:** 2
- **Imagen_Producto:** 1
- **Componente_Kit:** 1
- **Cupon:** 1
- **Promocion_Producto:** 1
- **Pedido:** 4
- **Item_Pedido:** 3
- **Pago:** 3
- **Movimiento_Stock:** 2
- **Aviso_Stock:** 1
- **Item_Carrito:** 1
- **Resena:** 2
- **Configuracion:** 1
- **Sin triggers:** Provincia, Mascota, Categoria, Etiqueta, Promocion, Carrito, Favorito.

**Total: 27 triggers.**