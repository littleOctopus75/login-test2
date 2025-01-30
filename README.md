# 📝 Sistema de Autenticación con Vue y Node.js

Este proyecto es un **sistema de autenticación completo** con:
- **Registro de usuarios**  
- **Inicio de sesión**  
- **Recuperación y restablecimiento de contraseña vía email**  
- **Protección con tokens**  

Utiliza **Vue 3 + Pinia** en el frontend y **Node.js + Express + MariaDB** en el backend.  

---

## 📌 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado en tu computadora:
- **Node.js** (`>= v16`) → [Descargar Node.js](https://nodejs.org/)  
- **MariaDB** (`>= 11.0.3`)  
- **Git** (opcional, pero recomendado)  
- **Un cliente SQL** (Ej: MySQL Workbench, DBeaver, HeidiSQL)  
- **Postman** (opcional, para probar API) → [Descargar Postman](https://www.postman.com/)

---

## 🛠️ Configuración del Proyecto

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/nombre-del-repositorio.git
cd nombre-del-repositorio
```

---

### 2️⃣ Configurar la Base de Datos
#### Crear la base de datos en MariaDB
```sql
CREATE DATABASE auth_system;
USE auth_system;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 3️⃣ Configurar el Backend
#### 📂 Ir a la Carpeta del Backend
```bash
cd backend
```

#### 📦 Instalar Dependencias
```bash
npm install
```

#### 🛠 Configurar Variables de Entorno
1️⃣ **Crea un archivo `.env` en `backend/` con este contenido:**
```ini
PORT=5000

# Configuración de la Base de Datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=auth_system

# Configuración de Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña

# Clave secreta para tokens
JWT_SECRET=tu_clave_secreta
```

#### 🔑 Generar Contraseña de Aplicación para Gmail
Si estás usando Gmail, necesitarás generar una **contraseña de aplicación**:
1. Accede a **[Gestor de Contraseñas de Google](https://myaccount.google.com/apppasswords)**.
2. Inicia sesión y selecciona "Generar una contraseña de aplicación".
3. Copia la contraseña generada y pégala en `EMAIL_PASS` en el archivo `.env`.

#### 🚀 Iniciar el Servidor Backend
```bash
npx nodemon server.js
```
Si ves **"Servidor corriendo en el puerto 5000"**, el backend está funcionando. ✅  

---

### 4️⃣ Configurar el Frontend
#### 📂 Ir a la Carpeta del Frontend
```bash
cd ../frontend
```

#### 📦 Instalar Dependencias
```bash
npm install
```

#### 🔧 Configurar API en `frontend/src/api.js`
```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth', // Asegúrate de que esta URL es correcta
});

export default api;
```

#### 🚀 Iniciar el Servidor Frontend
```bash
npm run dev
```

El terminal mostrará algo como:
```
VITE v4.5.9 ready in 348 ms
➜  Local: http://localhost:5173/
```
Abre **`http://localhost:5173/`** en tu navegador para ver la app funcionando. ✅  

---

## 🚀 Probar el Sistema
### 🛠 Endpoints Principales
Puedes probar las rutas usando **Postman** o directamente desde el frontend.

#### 📝 Registro de Usuario
```http
POST /api/auth/register
```
**Body (JSON):**
```json
{
    "email": "usuario@example.com",
    "password": "12345678"
}
```

#### 🔑 Inicio de Sesión
```http
POST /api/auth/login
```
**Body (JSON):**
```json
{
    "email": "usuario@example.com",
    "password": "12345678"
}
```

#### 🔁 Recuperar Contraseña
```http
POST /api/auth/forgot-password
```
**Body (JSON):**
```json
{
    "email": "usuario@example.com"
}
```

#### 🔄 Restablecer Contraseña
```http
POST /api/auth/reset-password
```
**Body (JSON):**
```json
{
    "token": "TOKEN_DEL_EMAIL",
    "newPassword": "nuevaContraseña123"
}
```

