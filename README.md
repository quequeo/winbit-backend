# Winbit Backend

Backend y panel de administración para Winbit. Next.js 16, Prisma, PostgreSQL.

## Estado

**Funcional** - Listo para demo

- Servidor: http://localhost:3000
- Base de datos: Supabase PostgreSQL
- Autenticación: Google OAuth
- Tests: 28 tests pasando (93.1% coverage)

## Tech Stack

- Next.js 16.1.1 (App Router)
- PostgreSQL (Supabase)
- Prisma 7.2.0
- NextAuth.js v5 (Google OAuth)
- Tailwind CSS + shadcn/ui
- Vitest + React Testing Library

## Features

- Autenticación Google OAuth
- Gestión de inversores
- Gestión de solicitudes (aprobar/rechazar)
- Dashboard con métricas y gráficos
- Api pública (4 endpoints para PWA)
- Historial automático de operaciones
- Notificaciones por email al aprobar depósitos

## Setup

1. Instalar dependencias: `npm install`

2. Configurar `.env`:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: Google Cloud Console
   - `NEXTAUTH_URL`: `http://localhost:3000`
   - `GOOGLE_SHEETS_ID`: ID de la planilla de Google Sheets
   - `GOOGLE_SHEETS_API_KEY`: API Key de Google Sheets
   - `RESEND_API_KEY`: (Opcional) API Key de Resend para emails. Si no se configura, los emails no se enviarán.
   - `RESEND_FROM_EMAIL`: (Opcional) Email desde el cual enviar. Formato: `Nombre <email@dominio.com>`

3. Base de datos (Supabase):
   - Crear proyecto en [Supabase](https://supabase.com)
   - Copiar Connection String → `DATABASE_URL`

4. Migraciones:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Ejecutar: `npm run dev`

## Scripts

- `npm run dev` - Desarrollo
- `npm run build` - Build producción
- `npm run test` - Tests
- `npm run test:coverage` - Tests con coverage
- `npx prisma studio` - UI de base de datos

## Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → Crear proyecto
2. APIs & Services → Credentials → OAuth client ID
3. Redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copiar Client ID y Secret a `.env`

## Api Pública (PWA)

- `GET /api/public/investor/:email` - Datos del inversor
- `GET /api/public/investor/:email/history` - Historial
- `GET /api/public/wallets` - Wallets habilitadas
- `POST /api/public/requests` - Crear solicitud

## Migración desde Google Sheets

Script para importar inversores y portfolios desde la planilla de Google Sheets:

```bash
# Previsualizar datos sin importar (recomendado primero)
npx tsx scripts/migrate-from-sheets.ts --dry-run

# Ejecutar migración real
npx tsx scripts/migrate-from-sheets.ts

# Especificar hoja diferente a DASHBOARD
npx tsx scripts/migrate-from-sheets.ts --sheet=INVESTORS
```

El script detecta automáticamente las columnas por nombre (email, nombre, saldo, etc.) y soporta variantes en español e inglés.

## Próximos Pasos

- ~~Migrar datos desde Google Sheets~~ ✅
- Conectar winbit-app al backend
- Implementar autenticación Firebase en Api
- Deploy a producción

## Documentación

- `DEPLOY.md` - Guía de deployment en Vercel
- `TESTING.md` - Información sobre tests y coverage

