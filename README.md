# 🏎️ AutoElite Motors - Tienda & Catálogo de Vehículos (Full-Stack)

Sistema web completo para tienda de vehículos con catálogo interactivo, autenticación mediante tokens JWT y panel administrativo con operaciones CRUD completas.

---

## Tecnologías Utilizadas

### Backend (Spring Boot 3.5.x / Java 22)
- **Spring Boot Starter Web**: Creación de la API RESTful.
- **Spring Boot Starter Security**: Autenticación y autorización basada en roles (`ROLE_ADMIN` y `ROLE_USER`).
- **JWT (io.jsonwebtoken / JJWT 0.11.5)**: Tokens de autenticación sin estado (Stateless).
- **Spring Boot Starter Data JPA / Hibernate**: Mapeo objeto-relacional y persistencia.
- **Base de datos H2 en memoria**: Cero configuración requerida, con consola web `/h2-console` habilitada.
- **Base de datos MySQL**: Perfil `mysql` disponible (`application-mysql.properties`) para uso con MySQL.
- **CORS Config**: Integración configurada con Angular (`http://localhost:4200`).
- **DataInitializer**: Carga automática inicial de 10 vehículos.

### Frontend (Angular 21 + Bootstrap 5)
- **Angular 21 (Standalone Components)**: Arquitectura moderna sin NgModules.
- **Angular Router & Guards**: Rutas protegidas (`adminGuard`) para el panel CRUD.
- **HTTP Interceptor**: Inyección automática de cabeceras `Authorization: Bearer <token>`.
- **Bootstrap 5 & Bootstrap Icons**: Diseño responsive y moderno enfocado en automoción.
- **Angular Signals**: Gestión reactiva del estado del usuario logueado.

---

## Cómo Ejecutar la Aplicación

### Ejecutar de Forma Manual (en dos terminales de VS Code)

#### 1. Iniciar el Backend (Spring Boot, Puerto 8080):
Abre una terminal en la carpeta raíz del proyecto y ejecuta:

```powershell
cd backend
set "JAVA_HOME=C:\Program Files\Java\jdk-22"
set "PATH=%JAVA_HOME%\bin;%PATH%"
"C:\Users\ENTERCORE\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd" spring-boot:run -o -Dspring-boot.run.profiles=mysql
```

> El backend estará disponible en: **http://localhost:8080**

#### 2. Iniciar el Frontend (Angular, Puerto 4200):
En una segunda terminal:

```powershell
cd frontend
npm start
```

> El frontend estará disponible en: **http://localhost:4200**

---

## Autenticación

No hay usuarios preconfigurados. Regístrate como nuevo usuario mediante el endpoint `POST /api/auth/register` o desde la pantalla de registro en el frontend, e inicia sesión con tus propias credenciales.

---

## Despliegue con Docker

El proyecto incluye `docker-compose.yml` para levantar los tres servicios (MySQL, Backend, Frontend) con un solo comando.

### Requisitos
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) instalados.

### Comandos

**Levantar todos los servicios:**
```bash
docker-compose up -d
```

**Ver logs en tiempo real:**
```bash
docker-compose logs -f
```

**Detener y eliminar contenedores:**
```bash
docker-compose down
```

**Detener y eliminar también el volumen de MySQL (borra los datos):**
```bash
docker-compose down -v
```

### Acceso
- **Frontend (Angular):** http://localhost:4200
- **Backend (Spring Boot API):** http://localhost:8081
- **MySQL:** localhost:3307 (usuario: `root`, contraseña: `tu_contraseña`, base de datos: `vehiculos_db`)

El backend se conecta automáticamente a MySQL a través del nombre de servicio `db` definido en el `docker-compose.yml`.

---

## Endpoints de la API REST

### Autenticación (`/api/auth`)
| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Inicia sesión y devuelve el token JWT y datos del usuario. | Público |
| `POST` | `/api/auth/register` | Registra un nuevo usuario con rol de cliente. | Público |
| `GET` | `/api/auth/me` | Obtiene el perfil del usuario autenticado actual. | Autenticado |

### Vehículos (`/api/vehiculos`)
| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehiculos` | Lista todos los vehículos (con filtros opcionales de marca, categoría y búsqueda). | Público |
| `GET` | `/api/vehiculos/{id}` | Obtiene los detalles de un vehículo por su ID. | Público |
| `GET` | `/api/vehiculos/marcas` | Lista las marcas disponibles para los filtros. | Público |
| `GET` | `/api/vehiculos/categorias` | Lista las categorías disponibles (SUV, Deportivo, Sedán, etc.). | Público |
| `POST` | `/api/vehiculos` | Crea un nuevo vehículo en el catálogo. | Solo `ROLE_ADMIN` |
| `PUT` | `/api/vehiculos/{id}` | Actualiza un vehículo existente. | Solo `ROLE_ADMIN` |
| `DELETE` | `/api/vehiculos/{id}` | Elimina un vehículo por su ID. | Solo `ROLE_ADMIN` |

---

## Características Visuales y Funcionales
1. **Catálogo de Vehículos**:
   - Tarjetas con efectos hover, imágenes en alta resolución e indicadores de disponibilidad.
   - Filtros combinados por texto, marca y categoría.
   - Modal con ficha técnica detallada (año, kilometraje, combustible, transmisión, color, descripción).
2. **Panel CRUD Administrativo**:
   - Resumen estadístico (KPIs de vehículos totales, disponibles, precio promedio y categorías).
   - Tabla interactiva con miniaturas de fotos, badges de estado y botones de acción.
   - Formulario modal con previsualización en vivo de la URL de la imagen del auto.
   - Confirmación de borrado para evitar eliminaciones accidentales.
3. **Manejo de Seguridad y Sesión**:
   - Interceptor HTTP que envía el token JWT automáticamente en cada petición que lo requiere.
   - Cierre de sesión seguro y persistencia con `localStorage`.
