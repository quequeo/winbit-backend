# Setup Winbit Backend

## Estado: Completado

- Next.js 16 (App Router + TypeScript + Tailwind)
- Prisma + PostgreSQL (Supabase)
- NextAuth (Google OAuth)
- shadcn/ui components
- CRUD inversores
- Gestión de solicitudes
- API pública (4 endpoints)
- Dashboard con métricas
- Tests (93.1% coverage)

**Servidor:** http://localhost:3000

## Configuración

### Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Settings → Database → Connection String
3. Copiar URL a `DATABASE_URL` en `.env`
4. Ejecutar migraciones:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → Crear proyecto
2. APIs & Services → Credentials → OAuth client ID
3. Tipo: Web application
4. Redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copiar a `.env`:
   ```bash
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   NEXTAUTH_SECRET="$(openssl rand -base64 32)"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### Ejecutar

```bash
npm run dev
```

Abrir http://localhost:3000 → Login con Google → Dashboard

## Troubleshooting

**Error: "User was denied access on the database"**
- Verificar `DATABASE_URL` en `.env`
- Ejecutar `npx prisma migrate dev`

**Error: "Invalid auth callback"**
- Verificar credenciales Google en `.env`
- Verificar redirect URI en Google Cloud Console

**Error: "Cannot find module '@prisma/client'"**
- Ejecutar `npx prisma generate`

