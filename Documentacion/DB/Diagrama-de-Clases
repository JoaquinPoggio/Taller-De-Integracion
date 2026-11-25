``` mermaid
classDiagram

class Usuario {
  +int id_usuario
  +string nombre
  +string nombre_usuario
  +string email
  +string contacto
  +RolUsuario rol
}


class Direccion {
  +int id_direccion
  +string calle
  +string numero
  +string codigo_postal
  +string referencia
}

class Localidad {
    +int id_localidad
}

class Provincia {
    +int id_provincia
}

class Producto {
  +int id_producto
  +string nombre
  +string descripcion
  +string marca
  +decimal precio
  +int stock_actual
  +boolean activo
  +boolean es_kit
  +Animal[] animales_recomendados
  +Tamano[] tamanos_recomendados
  +EtapaVida[] etapas_recomendadas
}

class Categoria {
  +int id_categoria
  +string nombre
  +string descripcion
}

class ImagenProducto {
  +int id_imagen
  +string url
  +string descripcion
}

class MovimientoStock {
  +int id_movimiento
  +TipoMovimiento tipo
  +int cantidad
  +string motivo
  +datetime fecha
}

class Carrito {
  +int id_carrito
  +datetime fecha_creacion
}

class ItemCarrito {
  +int cantidad
}

class Pedido {
  +int id_pedido
  +datetime fecha
  +decimal subtotal
  +decimal descuento_total
  +decimal costo_envio
  +decimal total
  +EstadoPedido estado
  +datetime fecha_limite_cancelacion
  +string direccion_entrega
  +decimal distancia_envio
}

class ItemPedido {
  +int cantidad
  +decimal precio_unitario
  +string nombre_producto
}

class Pago {
  +int id_pago
  +string identificador_mercado_pago
  +decimal monto
  +datetime fecha
  +EstadoPago estado
}

class TarifaEnvio {
  +int id_tarifa
  +decimal distancia_minima
  +decimal distancia_maxima
  +decimal costo
  +date fecha_inicio
  +date fecha_fin
  +boolean activa
}

class Promocion {
  +int id_promocion
  +string nombre
  +string descripcion
  +TipoDescuento tipo_descuento
  +decimal valor
  +datetime fecha_inicio
  +datetime fecha_fin
  +boolean activa
}

class Cupon {
  +int id_cupon
  +string codigo
  +TipoDescuento tipo_descuento
  +decimal valor
  +datetime fecha_inicio
  +datetime fecha_fin
  +boolean activo
  +int usos_maximos
  +int usos_actuales
}

class ComponenteKit {
  +int cantidad
}

class Resena {
  +int id_resena
  +int puntuacion
  +string comentario
  +datetime fecha
  +EstadoResena estado
  +string motivo_moderacion
  +datetime fecha_moderacion
}

class AvisoStock {
  +int id_aviso
  +datetime fecha_solicitud
  +boolean notificado
}

class Mascota {
  +int id_mascota
  +string nombre
  +date fecha_nacimiento
  +Animal animal
  +Tamano tamano
  +EtapaVida etapa_vida
}

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
  GRANDE
}

class EtapaVida {
  <<enumeration>>
  CACHORRO
  ADULTO
}

class EstadoPedido {
  <<enumeration>>
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
  OCULTA
  ELIMINADA
}

class TipoMovimiento {
  <<enumeration>>
  INGRESO
  EGRESO
}

class TipoDescuento {
  <<enumeration>>
  PORCENTAJE
  MONTO_FIJO
}

%% Usuarios
Usuario "1" -- "0..*" Direccion

%% Catálogo
Categoria "1" -- "0..*" Producto
Producto "1" *-- "0..*" ImagenProducto

%% Ubicación
Direccion "0..*" -- "1" Localidad
Localidad "0..*" -- "1" Provincia

%% Stock
Producto "1" -- "0..*" MovimientoStock
Usuario "1" -- "0..*" MovimientoStock : registra

%% Carrito
Usuario "1" -- "0..1" Carrito
Carrito "1" *-- "1..*" ItemCarrito
Producto "1" -- "0..*" ItemCarrito

%% Pedidos
Usuario "1" -- "0..*" Pedido
Pedido "1" *-- "1..*" ItemPedido
Producto "1" -- "0..*" ItemPedido
Pedido "1" -- "0..*" Pago

%% Envíos
TarifaEnvio "0..1" -- "0..*" Pedido

%% Promociones
Promocion "0..*" -- "0..*" Producto : aplica a
Promocion "0..*" -- "0..*" Categoria : aplica a
Pedido "0..*" -- "0..*" Promocion : recibe

%% Cupones
Cupon "0..1" -- "0..*" Pedido : aplicado en

%% Kits
Producto "1" -- "0..*" ComponenteKit : kit
Producto "1" -- "0..*" ComponenteKit : componente

%% Reseñas
Usuario "1" -- "0..*" Resena : escribe
Producto "1" -- "0..*" Resena : recibe
Pedido "1" -- "0..*" Resena : respalda
Usuario "0..1" -- "0..*" Resena : modera

%% Avisos de stock
Usuario "1" -- "0..*" AvisoStock
Producto "1" -- "0..*" AvisoStock

%% Mascotas
Usuario "1" -- "0..*" Mascota
```