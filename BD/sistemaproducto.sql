CREATE DATABASE IF NOT EXISTS sistemaproducto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sistemaproducto;


CREATE TABLE bodegas (
    id_bodega INT AUTO_INCREMENT PRIMARY KEY,
    nombre_bodega VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sucursales (
    id_sucursal INT AUTO_INCREMENT PRIMARY KEY,
    nombre_sucursal VARCHAR(100) NOT NULL,
    id_bodega INT NOT NULL,
    FOREIGN KEY (id_bodega) REFERENCES bodegas(id_bodega)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE monedas (
    id_moneda INT AUTO_INCREMENT PRIMARY KEY,
    codigo_moneda VARCHAR(10) NOT NULL,
    nombre_moneda VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE materiales (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nombre_material VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(15) UNIQUE NOT NULL,
    nombre_producto VARCHAR(50) NOT NULL,
    id_bodega INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_moneda INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_bodega) REFERENCES bodegas(id_bodega),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    FOREIGN KEY (id_moneda) REFERENCES monedas(id_moneda)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE producto_materiales (
    id_producto_material INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_material INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_material) REFERENCES materiales(id_material)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;