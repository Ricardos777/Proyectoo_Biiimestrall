# Proyecto Bimestral: API de Gestión de Ventas

Estimado profesor Braulio Echeverria,

A continuación, le presento el primer adelanto de mi Proyecto Bimestral, en el que he desarrollado una API en NodeJS para la gestión de ventas, productos y, de manera inicial, la administración de usuarios. Este documento está escrito desde mi perspectiva y está dirigido exclusivamente a usted, ya que es quien evaluará este avance.

---

## Introducción

Mi nombre es **Ricardo Yichkan Figueroa Juarez**, alumno de 6to perito en informática en la **Fundación Kinal**. Mi código personal de alumno es **2023370** y mi código técnico es **IN6BV**. Bajo su valiosa orientación, he emprendido el desarrollo de esta API que tiene como objetivo gestionar de forma segura y eficiente las operaciones comerciales de una empresa.

En esta primera fase, me he centrado en la **gestión de usuarios**, implementando funcionalidades que incluyen:

- **Registro de usuarios:** Permite crear nuevos usuarios, encriptando la contraseña y gestionando la carga de la foto de perfil.
- **Inicio de sesión:** Valida las credenciales del usuario y genera un token JWT.
- **Consulta y listado:** Permite obtener los datos de un usuario específico por su ID y listar todos los usuarios activos.
- **Actualización:** Facilita la modificación de datos del usuario, cambio de contraseña y actualización de la foto de perfil.
- **Eliminación lógica:** Permite desactivar usuarios sin borrarlos de la base de datos.

El objetivo es construir una base sólida sobre la cual se podrán implementar, en futuras fases, otras funcionalidades como la gestión de productos y ventas.

---

## Algoritmo de Funcionamiento

A continuación, describo en forma de pseudocódigo el funcionamiento general de la API, desde el inicio hasta la finalización de cada solicitud:

1. **Inicio del Programa**
   - Inicio en `index.js`.
   - Se cargan las variables de entorno desde el archivo `.env`.
   - Se invoca `initServer()` para arrancar el servidor.

2. **Inicialización del Servidor**
   - **Creación de la instancia de Express:**
     - Inicializo la aplicación Express.
   - **Configuración de Middlewares Globales:**
     - Configuro el parseo de JSON y URL-encoded.
     - Habilito CORS, Helmet y Morgan.
     - Aplico un limitador de peticiones (rate limiting).
   - **Conexión a la Base de Datos:**
     - Se establece la conexión a MongoDB mediante `dbConnection()`.
     - Se registran eventos para controlar el estado de la conexión.
   - **Configuración de Rutas:**
     - Se definen las rutas para la **Autenticación** (`/salesSystem/v1/auth`) y para la **Gestión de Usuarios** (`/salesSystem/v1/user`).
     - Se expone la documentación Swagger en `/api-docs`.
   - **Arranque del Servidor:**
     - El servidor escucha en el puerto especificado y se notifica en consola.

3. **Procesamiento de Solicitudes**
   - **Autenticación:**
     - **Registro:** Se reciben y validan los datos del usuario, se encripta la contraseña, se guarda el usuario en la BD y se procesa la subida de la foto de perfil.
     - **Login:** Se validan las credenciales, se verifica la contraseña y se genera un token JWT.
   - **Gestión de Usuarios:**
     - **Consulta por ID:** Se valida el token y se devuelve el usuario solicitado.
     - **Listado de Usuarios:** Se consulta de forma paginada la base de datos, mostrando solo usuarios activos.
     - **Eliminación:** Se cambia el estado del usuario a `false` (eliminación lógica).
     - **Actualización:** Se permiten cambios en los datos del usuario, incluyendo la contraseña (siempre verificando que la nueva no sea idéntica a la anterior) y la foto de perfil.
     
4. **Manejo de Errores**
   - Cada solicitud se procesa mediante middlewares de validación y manejo de errores.
   - En caso de error, se envía una respuesta JSON detallando la causa (con códigos 400 o 500).

5. **Finalización de la Solicitud**
   - Se envía la respuesta final al cliente, cerrando el ciclo de la petición.
   - Se registra la acción para seguimiento y auditoría.

---

## Instalación y Uso

### Requisitos

- **NodeJS** y **npm** instalados.
- **MongoDB** en funcionamiento.
- **Postman** (u otra herramienta similar) para probar los endpoints.

### Pasos para Ejecutar la API

1. **Clonar el Repositorio:**

   ```bash
   git clone <URL-del-repositorio>
   cd proyecto-bimestral
