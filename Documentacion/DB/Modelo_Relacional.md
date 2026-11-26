# Modelo relacional de la base de datos PetMarket Club

## Tablas : 
### Provincia
```text
VAR BASE RELATION Provincia (
id_provincia Int,
nombre VARCHAR(50),
costo_envio Decimal(10,2),
activa Boolean,
PRIMARY KEY (id_provincia)
)
```
### Usuario
```text
VAR BASE RELATION Usuario (
id_usuario UUID,
nombre VARCHAR(100),
nombre_usuario VARCHAR(50),
email VARCHAR(100),
contacto VARCHAR(30),
rol VARCHAR(20),
fecha_registro DateTime,
PRIMARY KEY (id_usuario)
)
```
### Direccion
```text
VAR BASE RELATION Direccion (
id_direccion Int,
id_usuario UUID,
id_provincia Int,
alias VARCHAR(50),
calle VARCHAR(100),
numero VARCHAR(10),
localidad VARCHAR(100),
codigo_postal VARCHAR(10),
referencia VARCHAR(100),
es_principal Boolean,
PRIMARY KEY (id_direccion),
FOREIGN KEY (id_usuario) REFERENCES Usuario,
FOREIGN KEY (id_provincia) REFERENCES Provincia
)
```
### Mascota
```text
VAR BASE RELATION Mascota (
id_mascota Int,
id_usuario UUID,
nombre VARCHAR(50),
animal VARCHAR(10),
tamano VARCHAR(10),
etapa_vida VARCHAR(10),
PRIMARY KEY (id_mascota),
FOREIGN KEY (id_usuario) REFERENCES Usuario
)
```
### Categoria
```text
VAR BASE RELATION Categoria (
id_categoria Int,
nombre VARCHAR(50),
PRIMARY KEY (id_categoria)
)
```
### Marca
```text
VAR BASE RELATION Marca (
id_marca Int,
nombre VARCHAR(50),
PRIMARY KEY (id_marca)
)
```
### Etiqueta
```text
VAR BASE RELATION Etiqueta (
id_etiqueta Int,
nombre VARCHAR(50),
etapa_vida VARCHAR(10),
tamano VARCHAR(10),
PRIMARY KEY (id_etiqueta)
)
```
### Producto
```text
VAR BASE RELATION Producto (
id_producto Int,
id_categoria Int,
id_marca Int,
id_etiqueta Int,
nombre VARCHAR(100),
descripcion VARCHAR(500),
precio Decimal(10,2),
stock_actual Int,
activo Boolean,
es_kit Boolean,
animal VARCHAR(10),
talle VARCHAR(2),
peso_gramos Int,
fecha_alta DateTime,
PRIMARY KEY (id_producto),
FOREIGN KEY (id_categoria) REFERENCES Categoria,
FOREIGN KEY (id_marca) REFERENCES Marca,
FOREIGN KEY (id_etiqueta) REFERENCES Etiqueta
)
```
### Imagen_Producto
```text
VAR BASE RELATION Imagen_Producto (
id_imagen Int,
id_producto Int,
url VARCHAR(255),
descripcion VARCHAR(100),
es_principal Boolean,
orden Int,
PRIMARY KEY (id_imagen),
FOREIGN KEY (id_producto) REFERENCES Producto
)
```
### Componente_Kit
```text
VAR BASE RELATION Componente_Kit (
id_kit Int,
id_componente Int,
cantidad Int,
PRIMARY KEY (id_kit, id_componente),
FOREIGN KEY (id_kit) REFERENCES Producto,
FOREIGN KEY (id_componente) REFERENCES Producto
)
```
### Cupon
```text
VAR BASE RELATION Cupon (
id_cupon Int,
codigo VARCHAR(30),
tipo_descuento VARCHAR(15),
valor Decimal(10,2),
fecha_inicio DateTime,
fecha_fin DateTime,
activo Boolean,
PRIMARY KEY (id_cupon)
)
```
### Promocion
```text
VAR BASE RELATION Promocion (
id_promocion Int,
nombre VARCHAR(100),
descripcion VARCHAR(255),
tipo_descuento VARCHAR(15),
valor Decimal(10,2),
fecha_inicio DateTime,
fecha_fin DateTime,
activa Boolean,
destacada Boolean,
PRIMARY KEY (id_promocion)
)
```
### Promocion_Producto
```text
VAR BASE RELATION Promocion_Producto (
id_promocion Int,
id_producto Int,
PRIMARY KEY (id_promocion, id_producto),
FOREIGN KEY (id_promocion) REFERENCES Promocion,
FOREIGN KEY (id_producto) REFERENCES Producto
)
```
### Pedido
```text
VAR BASE RELATION Pedido (
id_pedido Int,
id_usuario UUID,
id_provincia Int,
id_cupon Int,
fecha DateTime,
estado VARCHAR(15),
subtotal Decimal(10,2),
descuento_total Decimal(10,2),
costo_envio Decimal(10,2),
total Decimal(10,2),
fecha_limite_cancelacion DateTime,
nombre_destinatario VARCHAR(100),
telefono_contacto VARCHAR(30),
direccion_entrega VARCHAR(200),
localidad_entrega VARCHAR(100),
codigo_postal_entrega VARCHAR(10),
PRIMARY KEY (id_pedido),
FOREIGN KEY (id_usuario) REFERENCES Usuario,
FOREIGN KEY (id_provincia) REFERENCES Provincia,
FOREIGN KEY (id_cupon) REFERENCES Cupon
)
```
### Item_Pedido
```text
VAR BASE RELATION Item_Pedido (
id_item_pedido Int,
id_pedido Int,
id_producto Int,
id_promocion Int,
cantidad Int,
nombre_producto VARCHAR(100),
precio_original Decimal(10,2),
precio_unitario Decimal(10,2),
PRIMARY KEY (id_item_pedido),
FOREIGN KEY (id_pedido) REFERENCES Pedido,
FOREIGN KEY (id_producto) REFERENCES Producto,
FOREIGN KEY (id_promocion) REFERENCES Promocion
)
```
### Pago
```text
VAR BASE RELATION Pago (
id_pago Int,
id_pedido Int,
id_preferencia_mp VARCHAR(100),
id_pago_mp VARCHAR(100),
monto Decimal(10,2),
fecha DateTime,
estado VARCHAR(15),
PRIMARY KEY (id_pago),
FOREIGN KEY (id_pedido) REFERENCES Pedido
)
```
### Movimiento_Stock
```text
VAR BASE RELATION Movimiento_Stock (
id_movimiento Int,
id_producto Int,
id_usuario UUID,
id_pedido Int,
tipo VARCHAR(15),
cantidad Int,
motivo VARCHAR(200),
fecha DateTime,
PRIMARY KEY (id_movimiento),
FOREIGN KEY (id_producto) REFERENCES Producto,
FOREIGN KEY (id_usuario) REFERENCES Usuario,
FOREIGN KEY (id_pedido) REFERENCES Pedido
)
```
### Aviso_Stock
```text
VAR BASE RELATION Aviso_Stock (
id_aviso Int,
id_usuario UUID,
id_producto Int,
fecha_solicitud DateTime,
notificado Boolean,
PRIMARY KEY (id_aviso),
FOREIGN KEY (id_usuario) REFERENCES Usuario,
FOREIGN KEY (id_producto) REFERENCES Producto
)
```
### Carrito
```text
VAR BASE RELATION Carrito (
id_carrito Int,
id_usuario UUID,
fecha_creacion DateTime,
PRIMARY KEY (id_carrito),
FOREIGN KEY (id_usuario) REFERENCES Usuario
)
```
### Item_Carrito
```text
VAR BASE RELATION Item_Carrito (
id_carrito Int,
id_producto Int,
cantidad Int,
PRIMARY KEY (id_carrito, id_producto),
FOREIGN KEY (id_carrito) REFERENCES Carrito,
FOREIGN KEY (id_producto) REFERENCES Producto
)
```
### Favorito
```text
VAR BASE RELATION Favorito (
id_usuario UUID,
id_producto Int,
fecha_agregado DateTime,
PRIMARY KEY (id_usuario, id_producto),
FOREIGN KEY (id_usuario) REFERENCES Usuario,
FOREIGN KEY (id_producto) REFERENCES Producto
)
```
### Reseña
```text
VAR BASE RELATION Resena (
id_resena Int,
id_item_pedido Int,
id_moderador UUID,
puntuacion Int,
comentario VARCHAR(500),
fecha DateTime,
estado VARCHAR(15),
motivo_moderacion VARCHAR(200),
fecha_moderacion DateTime,
PRIMARY KEY (id_resena),
FOREIGN KEY (id_item_pedido) REFERENCES Item_Pedido,
FOREIGN KEY (id_moderador) REFERENCES Usuario
)
```
### Configuracion
```text
VAR BASE RELATION Configuracion (
clave VARCHAR(50),
valor VARCHAR(255),
PRIMARY KEY (clave)
)