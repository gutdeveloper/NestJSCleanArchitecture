# NestJS Clean Architecture

Este proyecto implementa una arquitectura limpia en NestJS, utilizando Prisma como ORM y siguiendo las mejores prácticas de desarrollo.

## Características

- 🏗️ Arquitectura limpia (Clean Architecture)
- 🔐 Autenticación con JWT
- 📦 Prisma como ORM
- 🛡️ Seguridad con Helmet
- 📝 Validación de datos con class-validator
- 🧪 Testing con Jest
- 🎨 Formateo de código con Prettier
- 📋 Linting con ESLint

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- SQLite (para desarrollo)

## Instalación

1. Instalar dependencias
```bash
npm install
```

2. Configurar la base de datos
```bash
npx prisma generate
```

## Desarrollo

Para iniciar el servidor en modo desarrollo:
```bash
npm run start:dev
```

## Scripts Disponibles

- `npm run start:dev` - Inicia el servidor en modo desarrollo con recarga automática
- `npm run build` - Compila el proyecto
- `npm run start:prod` - Inicia el servidor en modo producción
- `npm run test` - Ejecuta las pruebas unitarias
- `npm run test:watch` - Ejecuta las pruebas en modo watch
- `npm run test:coverage` - Genera reporte de cobertura de pruebas
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código

## Estructura del Proyecto

```
src/
├── application/    # Casos de uso y lógica de aplicación
├── domain/        # Entidades y reglas de negocio
├── infrastructure/ # Implementaciones concretas
└── presentation/  # Controladores y DTOs
```