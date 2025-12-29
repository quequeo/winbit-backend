# Winbit Backend

**✅ DEMO COMPLETADA** - Backend y panel de administración para Winbit, construido con Next.js 16, Prisma y PostgreSQL.

## 🎯 Estado Actual

**🚀 Funcional al 100%** - Listo para mostrar demo a Chueco

- ✅ **Servidor:** http://localhost:3000
- ✅ **Base de datos:** Supabase PostgreSQL conectada
- ✅ **Autenticación:** Google OAuth funcionando
- ✅ **Features:** CRUD inversores + gestión solicitudes
- ✅ **API:** 4 endpoints públicos para PWA
- ✅ **Tests:** 28 tests pasando (93.1% coverage)

## Tech Stack

- **Framework:** Next.js 16.1.1 (App Router + Turbopack)
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 7.2.0
- **Authentication:** NextAuth.js v5 (Google OAuth)
- **UI:** Tailwind CSS + shadcn/ui
- **Testing:** Vitest + React Testing Library
- **Hosting:** Vercel

## Características Implementadas

- 🔐 **Autenticación:** Google OAuth con NextAuth
- 👥 **CRUD Inversores:** Crear, listar, ver, activar/desactivar
- 💰 **Gestión Solicitudes:** Aprobar/rechazar retiros y depósitos
- 📊 **Dashboard:** Métricas en tiempo real (AUM, inversores, requests)
- 🔗 **API Pública:** 4 endpoints REST para winbit-app (PWA)
- 📈 **Historial:** Registro automático de todas las operaciones
- 🧪 **Testing:** 93.1% coverage con Vitest

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copiá `.env.example` a `.env` y completá las variables:

```bash
cp .env.example .env
```

**Variables necesarias:**
- `DATABASE_URL`: URL de PostgreSQL
- `NEXTAUTH_SECRET`: Generalo con `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: Desde Google Cloud Console
- Resto: opcionales para features adicionales

### 3. Configurar base de datos

**Opción A: Supabase (recomendado para demo)**

1. Creá una cuenta en [Supabase](https://supabase.com)
2. Creá un nuevo proyecto
3. Copiá el Connection String (Settings → Database → Connection String)
4. Pegala en `DATABASE_URL` (agregá `?pgbouncer=true` al final)

**Opción B: Vercel Postgres**

```bash
npx vercel env pull .env.local
```

### 4. Ejecutar migraciones

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. (Opcional) Cargar datos de ejemplo

```bash
npx prisma db seed
```

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Modo desarrollo
- `npm run build` - Build de producción
- `npm run start` - Ejecutar build
- `npx prisma studio` - UI visual de la base de datos
- `npx prisma migrate dev` - Crear/aplicar migraciones
- `npx prisma generate` - Generar Prisma Client

## Estructura

```
app/
├── (auth)/login/          # Página de login
├── (dashboard)/           # Rutas protegidas
│   ├── dashboard/         # Dashboard principal
│   ├── investors/         # CRUD inversores
│   ├── requests/          # Gestión de solicitudes
│   └── wallets/           # Gestión de wallets
└── api/
    ├── auth/              # NextAuth endpoints
    └── public/            # API pública para PWA
lib/
├── prisma.ts              # Prisma client singleton
├── auth.ts                # NextAuth config
└── utils.ts               # Utilidades
prisma/
└── schema.prisma          # Database schema
```

## Configurar Google OAuth

1. Andá a [Google Cloud Console](https://console.cloud.google.com)
2. Creá un proyecto nuevo (o usá uno existente)
3. Habilitá Google+ API
4. Creá credenciales OAuth 2.0:
   - Tipo: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Para producción agregá: `https://tu-dominio.com/api/auth/callback/google`
5. Copiá Client ID y Client Secret a `.env`

## Base de Datos

El schema incluye:
- `User` - Usuarios admin
- `Investor` - Inversores
- `Portfolio` - Estado actual del portfolio
- `PortfolioHistory` - Historial de movimientos
- `Wallet` - Direcciones de wallets
- `Request` - Solicitudes de retiro/depósito

Ver `prisma/schema.prisma` para detalles.

## Deploy

### Vercel (recomendado)

```bash
npx vercel
```

No olvides configurar las variables de entorno en Vercel Dashboard.

## 🎉 Demo Completada

### ✅ Features Implementadas

- ✅ **CRUD Inversores** (`/investors`)
  - Lista con tabla completa
  - Crear nuevo inversor
  - Ver detalle individual
  - Activar/desactivar

- ✅ **Gestión Solicitudes** (`/requests`)
  - Lista con filtros
  - Aprobar (actualiza balance automático)
  - Rechazar con notas

- ✅ **API Pública** (`/api/public/*`)
  - `GET /investor/:email` - Datos del inversor
  - `GET /investor/:email/history` - Historial
  - `GET /wallets` - Wallets habilitadas
  - `POST /requests` - Crear solicitud

- ✅ **Dashboard** - Métricas en tiempo real
- ✅ **Tests** - 93.1% coverage

### 📋 Próximos Pasos (Post-Demo)

- [ ] Migrar datos desde Google Sheets de Chueco
- [ ] Conectar winbit-app (PWA) al backend
- [ ] Implementar autenticación Firebase en API
- [ ] Deploy a producción (Vercel)
- [ ] Configurar dominio personalizado

### 📖 Documentación

- **`DEMO_READY.md`** - Guion para mostrar a Chueco
- **`STATUS.md`** - Estado actual del proyecto
- **`TESTING.md`** - Documentación de tests
- **`SETUP.md`** - Setup inicial (completado)

## Licencia

Propiedad de Winbit - Uso interno únicamente
