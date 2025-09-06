This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# APOLO Frontend

## 📋 Descripción General

El frontend de APOLO es una aplicación web desarrollada con **Next.js** y **React**, orientada a ofrecer una experiencia moderna, rápida y escalable para la plataforma social de música. Permite a los usuarios explorar música, interactuar socialmente, gestionar listas, publicar artículos y mucho más.

## 🏗️ Arquitectura General

### Stack Tecnológico

- **Framework**: Next.js (React)
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules, PostCSS
- **Gestión de estado**: Context API, hooks personalizados
- **Consumo de APIs**: RESTful APIs del backend
- **Autenticación**: OAuth, JWT (integración con backend)
- **Optimización**: SSR (Server Side Rendering), SSG (Static Site Generation)

### Estructura del Proyecto

```
src/
├── app/                # Rutas y páginas principales (Next.js App Router)
│   ├── albums/         # Páginas de álbumes
│   ├── artists/        # Páginas de artistas
│   ├── explore/        # Descubrimiento de música
│   ├── news/           # Noticias y artículos
│   ├── login/          # Autenticación
│   ├── register/       # Registro de usuarios
│   ├── songs/          # Páginas de canciones
│   └── users/          # Perfiles de usuario
├── components/         # Componentes reutilizables UI y funcionales
│   ├── album/          # Vista y gestión de álbumes
│   ├── artist/         # Vista y gestión de artistas
│   ├── auth/           # Formularios y lógica de autenticación
│   ├── charts/         # Rankings y estadísticas
│   ├── explore/        # Componentes de exploración
│   ├── favorites/      # Gestión de favoritos
│   ├── header/         # Navegación principal
│   ├── home/           # Página principal
│   ├── lists/          # Listas de reproducción
│   ├── news/           # Artículos y noticias
│   ├── notifications/  # Notificaciones
│   ├── profile/        # Perfil de usuario
│   ├── reviews/        # Reseñas y calificaciones
│   └── ui/             # Elementos de interfaz (botones, inputs, etc.)
├── constants/          # Constantes globales
├── contexts/           # Contextos de React para estado global
├── data/               # Datos estáticos (ej. países)
├── hooks/              # Hooks personalizados para lógica de negocio
├── lib/                # Utilidades generales (auth, helpers)
├── mocks/              # Datos mock para desarrollo
├── repositories/       # Lógica de acceso a datos y APIs
├── services/           # Servicios para interacción con backend
├── types/              # Tipos y modelos TypeScript
├── utils/              # Funciones utilitarias
```

## 🔧 Componentes Principales

### 1. **Rutas y Páginas (`app/`)**

- **Propósito**: Estructura de navegación y vistas principales
- **Características**:
  - SSR y SSG para mejor rendimiento y SEO
  - Páginas para álbumes, artistas, noticias, login, registro, usuarios, etc.

### 2. **Componentes UI (`components/`)**

- **Propósito**: Elementos visuales reutilizables
- **Características**:
  - Componentes para álbumes, artistas, listas, favoritos, reseñas, noticias, etc.
  - Componentes de interfaz (botones, inputs, modales, skeletons)

### 3. **Gestión de Estado (`contexts/`, `hooks/`)**

- **Propósito**: Estado global y lógica compartida
- **Características**:
  - Contextos para notificaciones, usuario actual, etc.
  - Hooks personalizados para acceso a datos, autenticación, formularios

### 4. **Consumo de APIs (`repositories/`, `services/`)**

- **Propósito**: Comunicación con el backend
- **Características**:
  - Repositorios para cada entidad (artículos, usuarios, listas, favoritos, etc.)
  - Servicios para lógica de negocio y llamadas HTTP

### 5. **Gestión de Tipos (`types/`)**

- **Propósito**: Modelado de datos y tipado fuerte
- **Características**:
  - Tipos para usuarios, artículos, canciones, listas, favoritos, notificaciones, etc.

### 6. **Utilidades (`utils/`, `lib/`)**

- **Propósito**: Funciones auxiliares y helpers
- **Características**:
  - Validaciones, normalización de datos, manejo de fechas, permisos, imágenes

## 🗄️ Flujo de Datos

1. El usuario navega por la aplicación y realiza acciones (login, explorar, comentar, etc.)
2. Los componentes y hooks gestionan el estado y disparan llamadas a los servicios/repositories
3. Los servicios consumen la API del backend y devuelven los datos tipados
4. Los datos se muestran en los componentes UI, actualizando el estado global/contexto si es necesario
5. Las acciones del usuario (favoritos, listas, reseñas, comentarios) se sincronizan con el backend

## 🔐 Seguridad y Autenticación

- Integración con OAuth y JWT (login, registro, recuperación de contraseña)
- Protección de rutas y componentes según permisos y roles
- Validación de formularios y datos en frontend antes de enviar al backend

## 🚀 Características Destacadas

- **Escalabilidad**: Arquitectura modular y componentes reutilizables
- **Rendimiento**: SSR/SSG, optimización de recursos y lazy loading
- **Mantenibilidad**: Tipado fuerte, separación de lógica y presentación
- **Experiencia de usuario**: Interfaz moderna, notificaciones, feedback visual
- **Integración total**: Comunicación fluida con el backend y APIs externas

## ⚙️ Scripts y Configuración

- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilación para producción
- `npm run lint` - Linting de código
- Variables de entorno en `.env.local` para endpoints, claves OAuth, etc.
