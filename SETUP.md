# Setup Winbit Backend - Próximos Pasos

## ✅ Completado

- ✅ Proyecto Next.js inicializado (App Router + TypeScript + Tailwind)
- ✅ Prisma instalado y configurado
- ✅ NextAuth configurado (Google OAuth)
- ✅ shadcn/ui instalado (button, input, card, table)
- ✅ Schema de base de datos definido (Investor, Portfolio, Request, Wallet, etc.)
- ✅ Páginas básicas: login y dashboard
- ✅ Middleware de autenticación
- ✅ Build verificado (compila correctamente)

## 🔧 Siguiente: Configurar Base de Datos

### Opción A: Supabase (Recomendado para demo gratuita)

1. **Crear cuenta y proyecto:**
   - Andá a https://supabase.com
   - Creá un nuevo proyecto
   - Elegí región: South America (Sao Paulo)
   - Anotá la contraseña que generás

2. **Obtener connection string:**
   - Settings → Database → Connection String
   - Copiá la URL (ya incluye la contraseña)
   - Formato: `postgresql://postgres.xxx:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`

3. **Configurar en el proyecto:**
   ```bash
   cd /Users/jaime/Desktop/Apps/winbit-backend
   echo 'DATABASE_URL="TU_URL_AQUI"' >> .env
   ```

4. **Ejecutar migraciones:**
   ```bash
   npx prisma migrate dev --name init
   ```

### Opción B: Vercel Postgres

1. **Desde el proyecto:**
   ```bash
   cd /Users/jaime/Desktop/Apps/winbit-backend
   npx vercel link
   npx vercel env pull .env.local
   ```

2. **Crear base de datos:**
   - Storage → Create Database → Postgres
   - Configuración automática

3. **Ejecutar migraciones:**
   ```bash
   npx prisma migrate dev --name init
   ```

## 🔑 Configurar Google OAuth

1. **Google Cloud Console:**
   - Andá a https://console.cloud.google.com
   - Creá o seleccioná un proyecto
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID

2. **Configurar OAuth:**
   - Application type: Web application
   - Name: Winbit Backend
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - (después agregás la URL de producción)

3. **Copiar credenciales al .env:**
   ```bash
   echo 'GOOGLE_CLIENT_ID="tu_client_id"' >> .env
   echo 'GOOGLE_CLIENT_SECRET="tu_client_secret"' >> .env
   ```

4. **Generar NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   echo 'NEXTAUTH_SECRET="el_resultado"' >> .env
   ```

5. **Configurar NEXTAUTH_URL:**
   ```bash
   echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env
   ```

## 🚀 Ejecutar en desarrollo

```bash
cd /Users/jaime/Desktop/Apps/winbit-backend
npm run dev
```

Abrí http://localhost:3000

- Redirige a `/login`
- Click en "Iniciar sesión con Google"
- Después de autenticarte, redirige a `/dashboard`
- Dashboard muestra estadísticas básicas (0 inversores, $0 AUM, etc.)

## 📝 Próximas Tareas (Para la Demo)

### 1. CRUD de Inversores
- [ ] Crear `/dashboard/investors/page.tsx` (lista de inversores)
- [ ] Crear `/dashboard/investors/new/page.tsx` (formulario para agregar)
- [ ] Crear `/dashboard/investors/[id]/page.tsx` (ver detalles)
- [ ] Server Actions para crear/editar/eliminar

### 2. Gestión de Requests
- [ ] Crear `/dashboard/requests/page.tsx` (lista de solicitudes)
- [ ] Crear `/dashboard/requests/[id]/page.tsx` (ver detalles)
- [ ] Botones de aprobar/rechazar
- [ ] Al aprobar → actualiza balance del inversor

### 3. API Pública (para PWA)
- [ ] Crear `/api/public/investor/[email]/route.ts` (GET portfolio data)
- [ ] Crear `/api/public/investor/[email]/history/route.ts` (GET historial)
- [ ] Crear `/api/public/wallets/route.ts` (GET wallets habilitadas)
- [ ] Crear `/api/public/requests/route.ts` (POST nueva solicitud)
- [ ] Middleware para verificar token de Firebase

### 4. Migración desde Google Sheets
- [ ] Script para leer Google Sheets y popular la DB
- [ ] Mapear inversores (email → Investor)
- [ ] Mapear portfolios (balances, returns)
- [ ] Mapear historial

### 5. Conectar PWA al Backend
- [ ] En `winbit-app/src/services/sheets.js` → reemplazar por llamadas al backend
- [ ] Pasar Firebase ID token en header `Authorization`
- [ ] Actualizar `useInvestorData` hook

## 🎯 Goal de la Demo

Mostrarle a Chueco:
1. **Login admin** → panel de control
2. **Lista de inversores** → datos reales migrados desde su Sheet
3. **Solicitudes pendientes** → aprobar/rechazar con 1 click
4. **PWA funcionando** → conectado al backend (no más Google Sheets)

Beneficios vs. Excel:
- ✅ Datos centralizados y seguros
- ✅ Aprobaciones instantáneas (sin editar manualmente)
- ✅ Historial automático
- ✅ Escalable (más inversores, más features)
- ✅ No depende de permisos de Google Sheets

## 💡 Tips

- Usá `npx prisma studio` para ver/editar la DB visualmente
- Usá `npm run dev -- --turbo` para desarrollo más rápido
- Commitea frecuentemente mientras desarrollás
- Testeá cada feature antes de pasar a la siguiente

## 🐛 Troubleshooting

**Error: "User was denied access on the database"**
- → Verificá que `DATABASE_URL` esté en `.env`
- → Verificá que ejecutaste `npx prisma migrate dev`

**Error: "Invalid `auth` callback"**
- → Verificá que las credenciales de Google estén en `.env`
- → Verificá que la redirect URI esté configurada en Google Cloud Console

**Error: "Cannot find module '@prisma/client'"**
- → Ejecutá `npx prisma generate`

¡Éxito! 🚀

