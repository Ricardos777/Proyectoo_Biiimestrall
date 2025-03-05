# Proyecto Bimestral: API de Gestión de Ventas

Estimado profesor **Braulio Echeverría**,

A continuación, le presento la versión **completa** de mi Proyecto Bimestral, en el que he desarrollado una API en NodeJS para la gestión de ventas, productos, usuarios y otras funcionalidades solicitadas. Este documento está escrito **desde mi perspectiva** y está dirigido exclusivamente a usted, ya que es quien evaluará este trabajo.

---

## Introducción

Mi nombre es **Ricardo Yichkan Figueroa Juarez**, alumno de 6to perito en informática en la **Fundación Kinal**.  
- **Código personal de alumno**: 2023370  
- **Código técnico**: IN6BV  

Bajo su orientación, he construido esta API que busca **gestionar de forma segura y eficiente** las operaciones comerciales de una empresa. A lo largo de su desarrollo, he aplicado **buenas prácticas** de programación en JavaScript y **estructuras lógicas** que me permiten un código ordenado, escalable y seguro.

---

## Funcionalidades Implementadas

A lo largo de las fases, se han implementado **10 puntos clave** que cubren la totalidad de los requerimientos:

1. **Autenticación y Autorización**  
   - Registro de usuarios con **rol forzado** a CLIENT (excepto el admin por defecto).  
   - Inicio de sesión con **JWT**.  
   - Middleware de validación de token y roles.

2. **Gestión de Categorías (ADMIN)**  
   - Crear, listar, editar y eliminar categorías.  
   - Reasignación automática de productos a la categoría **General** si se elimina otra categoría.

3. **Gestión de Productos (ADMIN)**  
   - CRUD de productos: agregar, visualizar, editar y eliminar.  
   - Control de inventario y marca de agotado (`isSoldOut`).  
   - Obtener productos más vendidos (ordenados por campo `sold`).

4. **Exploración de Productos (CLIENT)**  
   - Listar catálogo de productos (con paginación y filtros).  
   - Filtrar por categorías y buscar por nombre (case-insensitive).  
   - Ver productos más vendidos.

5. **Gestión de Carrito de Compras (CLIENT)**  
   - Agregar productos al carrito.  
   - Actualizar cantidades de productos en el carrito.  
   - Eliminar productos del carrito.  
   - Persistencia en MongoDB mediante el modelo `Cart`.

6. **Proceso de Compra (CLIENT)**  
   - Generar **facturas en PDF** al confirmar la compra (`checkout`).  
   - Validar stock de cada producto antes de concretar la venta.

7. **Gestión de Facturas (ADMIN/CLIENT)**  
   - Visualizar facturas por usuario (CLIENT ve solo las suyas, ADMIN ve todas).  
   - Mostrar detalles de cada factura.  
   - Permitir edición de facturas con **validación de stock** (solo ADMIN).

8. **Historial de Compras (CLIENT)**  
   - Listar compras realizadas por el usuario autenticado (`GET /invoice/history`).

9. **Gestión de Perfil (CLIENT)**  
   - Editar información personal (datos, contraseña, foto de perfil).  
   - Eliminar cuenta con confirmación de contraseña y medidas de seguridad.

10. **Optimización y Seguridad**  
   - Validaciones en los endpoints mediante **express-validator** y middlewares.  
   - Manejo de errores centralizado (códigos 400 y 500).  
   - Control de acceso por rol (ADMIN/CLIENT) y limitador de peticiones (rate-limit).

---

## Algoritmo de Funcionamiento

A continuación, describo el flujo general (pseudocódigo) de la API:

1. **Inicio del Programa**  
   - Comienza en `index.js`.  
   - Se cargan variables de entorno desde `.env`.  
   - Se llama a `initServer()` para levantar el servidor.

2. **Inicialización del Servidor**  
   - **Express** crea la aplicación.  
   - **Middlewares globales**: parseo de JSON, CORS, Helmet, Morgan, rate-limit.  
   - **Conexión a MongoDB** vía `dbConnection()`.  
   - **Creación del admin por defecto** y de la **categoría General** por defecto.  
   - **Rutas**:  
     - Autenticación: `/salesSystem/v1/auth`  
     - Usuarios: `/salesSystem/v1/user`  
     - Categorías: `/salesSystem/v1/category`  
     - Productos: `/salesSystem/v1/product` (ADMIN)  
     - Exploración de productos: `/salesSystem/v1/client/products` (CLIENT)  
     - Carrito: `/salesSystem/v1/cart` (CLIENT)  
     - Facturas: `/salesSystem/v1/invoice` (CLIENT/ADMIN)  
   - **Documentación Swagger** en `/api-docs`.  
   - **Arranque**: se inicia en el puerto definido en `.env`.

3. **Procesamiento de Solicitudes**  
   - **Autenticación**:  
     - **Register**: encripta contraseña, crea usuario con rol CLIENT, gestiona foto de perfil.  
     - **Login**: valida credenciales, genera JWT, maneja errores de credenciales.  
   - **Gestión de Usuarios**:  
     - **Consulta por ID**: requiere JWT y valida rol.  
     - **Listado**: paginado de usuarios activos.  
     - **Eliminación**: marca `status = false`.  
     - **Actualización**: modifica datos y/o contraseña (verificando que no sea la misma).  
     - **Eliminación de Cuenta**: requiere confirmar contraseña.  
   - **Gestión de Categorías** (ADMIN):  
     - Crear/editar/eliminar categoría, reasignando productos a "General" si se borra.  
   - **Gestión de Productos** (ADMIN):  
     - CRUD completo, control de inventario y `isSoldOut`, obtener más vendidos.  
   - **Exploración de Productos** (CLIENT):  
     - Listado, filtros por categoría, búsqueda por nombre, productos más vendidos.  
   - **Carrito de Compras** (CLIENT):  
     - Agregar/actualizar/eliminar productos.  
   - **Proceso de Compra** (CLIENT):  
     - **Checkout**: valida stock, descuenta inventario, genera factura y PDF.  
   - **Gestión de Facturas** (ADMIN/CLIENT):  
     - Visualizar facturas (CLIENT ve solo las suyas).  
     - Detalle de factura, actualización de factura (ADMIN) con validación de stock.  
   - **Historial de Compras** (CLIENT):  
     - `GET /invoice/history`: obtiene facturas del usuario autenticado.

4. **Manejo de Errores**  
   - Middlewares capturan validaciones (express-validator) y devuelven JSON con códigos 400 o 500.  
   - Se centraliza la lógica en `handle-errors.js` para devolver un mensaje amigable.

5. **Finalización de la Solicitud**  
   - Se envía la respuesta final.  
   - Se registra la acción en consola o logs.

---

## Instalación y Uso

### Requisitos Previos

- **Node.js** y **npm** instalados.  
- **MongoDB** en funcionamiento (local o remoto).  
- **Postman** (u otra herramienta) para probar los endpoints.  
- **Git** (opcional, para clonar el repositorio).

### Pasos para Ejecutar la API

1. **Clonar el Repositorio** (o descargar el código):
   ```bash
   git clone <URL-DEL-REPOSITORIO>
   cd proyecto-bimestral

```bash
proyecto-bimestral
├── .env
├── .gitignore
├── README.md
├── index.js
├── package.json
├── configs
│   ├── mongo.js
│   ├── server.js
│   └── swagger.js
├── public
│   └── uploads
│       └── profile-pictures
└── src
    ├── auth
    │   ├── auth.controller.js
    │   └── auth.routes.js
    ├── cart
    │   ├── cart.controller.js
    │   ├── cart.model.js
    │   └── cart.routes.js
    ├── category
    │   ├── category.controller.js
    │   ├── category.model.js
    │   └── category.routes.js
    ├── helpers
    │   ├── db-validators.js
    │   └── generate-jwt.js
    ├── invoice
    │   ├── invoice.controller.js
    │   ├── invoice.model.js
    │   └── invoice.routes.js
    ├── middlewares
    │   ├── category-validators.js
    │   ├── delete-file-on-error.js
    │   ├── handle-errors.js
    │   ├── multer-uploads.js
    │   ├── pet-validators.js
    │   ├── rate-limit-validator.js
    │   ├── user-validators.js
    │   ├── validate-fields.js
    │   ├── validate-jwt.js
    │   └── validate-roles.js
    ├── product
    │   ├── clientProduct.controller.js
    │   ├── clientProduct.routes.js
    │   ├── product.controller.js
    │   ├── product.model.js
    │   └── product.routes.js
    └── user
        ├── user.controller.js
        ├── user.model.js
        └── user.routes.js






Endpoints Principales
Autenticación

POST /auth/register
POST /auth/login
Usuarios

GET /user (ADMIN)
GET /user/findUser/:uid
PUT /user/updateUser/:uid
PATCH /user/updatePassword/:uid
PATCH /user/updateProfilePicture/:uid
DELETE /user/deleteUser/:uid (ADMIN)
DELETE /user/deleteAccount (CLIENT)
Categorías (ADMIN)

POST /category
GET /category
PUT /category/:id
DELETE /category/:id
Productos (ADMIN)

POST /product
GET /product
GET /product/:id
PUT /product/:id
DELETE /product/:id
GET /product/mostSold
Exploración de Productos (CLIENT)

GET /client/products (filtros: search, category, limite, desde)
GET /client/products/mostSold
Carrito (CLIENT)

GET /cart
POST /cart/add
PATCH /cart/update
DELETE /cart/remove
Facturas

POST /invoice/checkout (CLIENT)
GET /invoice/user/:userId (ADMIN o owner)
GET /invoice/:invoiceId (ADMIN o owner)
PUT /invoice/:invoiceId (ADMIN)
GET /invoice/history (CLIENT)
