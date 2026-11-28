``` mermaid
classDiagram

%% ============ ENUMERACIONES ============

class RolUsuario {
  <<enumeration>>
  CLIENTE
  ADMINISTRADOR
}

class Animal {
  <<enumeration>>
  PERRO
  GATO
  AVE
}

class Tamano {
  <<enumeration>>
  PEQUENO
  MEDIANO
  GRANDE
}

class EtapaVida {
  <<enumeration>>
  CACHORRO
  ADULTO
}

class Talle {
  <<enumeration>>
  S
  M
  L
  XL
}

class EstadoPedido {
  <<enumeration>>
  PENDIENTE_PAGO
  EN_ESPERA
  PREPARADO
  ENVIADO
  ENTREGADO
  CANCELADO
}

class EstadoPago {
  <<enumeration>>
  PENDIENTE
  APROBADO
  RECHAZADO
  CANCELADO
}

class EstadoResena {
  <<enumeration>>
  PUBLICADA
  ELIMINADA
}

class TipoMovimiento {
  <<enumeration>>
  INGRESO
  VENTA
  EXTRACCION
  CANCELACION
}

class TipoDescuento {
  <<enumeration>>
  PORCENTAJE
  MONTO_FIJO
}

%% ============ USUARIOS Y UBICACION ============

class Usuario {
  +UUID id_usuario
  +string nombre
  +string nombre_usuario
  +string email
  +string contacto
  +RolUsuario rol
  +datetime fecha_registro
}

class Direccion {
  +int id_direccion
  +string alias
  +string calle
  +string numero
  +string localidad
  +string codigo_postal
  +string referencia
  +boolean es_principal
}

class Provincia {
  +int id_provincia
  +string nombre
  +decimal costo_envio
  +boolean activa
}

class Mascota {
  +int id_mascota
  +string nombre
  +Animal animal
  +Tamano tamano
  +EtapaVida etapa_vida
}

%% ============ CATALOGO ============

class Categoria {
  +int id_categoria
  +string nombre
}

class Marca {
  +int id_marca
  +string nombre
}

class Etiqueta {
  +int id_etiqueta
  +string nombre
  +EtapaVida etapa_vida
  +Tamano tamano
}

class Producto {
  +int id_producto
  +string nombre
  +string descripcion
  +decimal precio
  +int stock_actual
  +boolean activo
  +boolean es_kit
  +Animal animal
  +Talle talle
  +int peso_gramos
  +datetime fecha_alta
}

class ImagenProducto {
  +int id_imagen
  +string url
  +string descripcion
  +boolean es_principal
  +int orden
}

class ComponenteKit {
  +int cantidad
}

%% ============ STOCK ============

class MovimientoStock {
  +int id_movimiento
  +TipoMovimiento tipo
  +int cantidad
  +string motivo
  +datetime fecha
}

class AvisoStock {
  +int id_aviso
  +datetime fecha_solicitud
  +boolean notificado
}

%% ============ CARRITO Y FAVORITOS ============

class Carrito {
  +int id_carrito
  +datetime fecha_creacion
}

class ItemCarrito {
  +int cantidad
}

class Favorito {
  +datetime fecha_agregado
}

%% ============ PEDIDOS Y PAGOS ============

class Pedido {
  +int id_pedido
  +datetime fecha
  +EstadoPedido estado
  +decimal subtotal
  +decimal descuento_total
  +decimal costo_envio
  +decimal total
  +datetime fecha_limite_cancelacion
  +string nombre_destinatario
  +string telefono_contacto
  +string direccion_entrega
  +string localidad_entrega
  +string codigo_postal_entrega
}

class ItemPedido {
  +int id_item_pedido
  +int cantidad
  +string nombre_producto
  +decimal precio_original
  +decimal precio_unitario
}

class Pago {
  +int id_pago
  +string id_preferencia_mp
  +string id_pago_mp
  +decimal monto
  +datetime fecha
  +EstadoPago estado
}

%% ============ PROMOCIONES Y CUPONES ============

class Promocion {
  +int id_promocion
  +string nombre
  +string descripcion
  +TipoDescuento tipo_descuento
  +decimal valor
  +datetime fecha_inicio
  +datetime fecha_fin
  +boolean activa
  +boolean destacada
}

class Cupon {
  +int id_cupon
  +string codigo
  +TipoDescuento tipo_descuento
  +decimal valor
  +datetime fecha_inicio
  +datetime fecha_fin
  +boolean activo
}

%% ============ RESENAS ============

class Resena {
  +int id_resena
  +int puntuacion
  +string comentario
  +datetime fecha
  +EstadoResena estado
  +string motivo_moderacion
  +datetime fecha_moderacion
}

%% ============ CONFIGURACION ============

class Configuracion {
  +string clave
  +string valor
}

%% ============ RELACIONES ============

%% Usuarios y ubicacion
Usuario "1" -- "0..*" Direccion : tiene
Direccion "0..*" -- "1" Provincia : pertenece a
Usuario "1" -- "0..*" Mascota : tiene

%% Catalogo
Categoria "1" -- "0..*" Producto : clasifica
Marca "0..1" -- "0..*" Producto : es de
Etiqueta "0..1" -- "0..*" Producto : recomienda
Producto "1" *-- "0..*" ImagenProducto : tiene
Producto "1" -- "0..*" ComponenteKit : kit
Producto "1" -- "0..*" ComponenteKit : componente

%% Stock
Producto "1" -- "0..*" MovimientoStock : registra
Usuario "0..1" -- "0..*" MovimientoStock : realiza
Pedido "0..1" -- "0..*" MovimientoStock : genera
Usuario "1" -- "0..*" AvisoStock : solicita
Producto "1" -- "0..*" AvisoStock : sobre

%% Carrito y favoritos
Usuario "1" -- "0..1" Carrito : posee
Carrito "1" *-- "0..*" ItemCarrito : contiene
Producto "1" -- "0..*" ItemCarrito : corresponde a
Usuario "1" -- "0..*" Favorito : guarda
Producto "1" -- "0..*" Favorito : referencia

%% Pedidos y pagos
Usuario "1" -- "0..*" Pedido : realiza
Pedido "1" *-- "1..*" ItemPedido : detalla
Producto "1" -- "0..*" ItemPedido : corresponde a
Pedido "1" -- "0..*" Pago : se abona con
Pedido "0..*" -- "1" Provincia : se envia a
Cupon "0..1" -- "0..*" Pedido : aplicado en
Promocion "0..1" -- "0..*" ItemPedido : aplicada en

%% Promociones
Promocion "0..*" -- "0..*" Producto : aplica a

%% Resenas
ItemPedido "1" -- "0..1" Resena : respalda
Usuario "0..1" -- "0..*" Resena : modera

%% ============ NOTAS ============

note for Producto "Kit: es_kit = true. No tiene stock propio, se calcula con sus componentes. Un kit no puede contener otro kit."
note for Pedido "Los datos de entrega y costo_envio se copian al comprar, para que no cambien si despues se modifica la direccion o la tarifa."
note for Etiqueta "Una sola etiqueta por producto. Los campos etapa_vida y tamano son opcionales."
```