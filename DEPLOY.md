# Deploy - Winbit Backend

## Opción Recomendada: Vercel

Vercel es la plataforma oficial de Next.js, con deploy automático desde Git y configuración mínima.

## Pasos para Deploy en Vercel

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en GitHub, GitLab o Bitbucket:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Crear Cuenta en Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Sign up con GitHub (recomendado) o email
3. Conectar tu repositorio

### 3. Configurar el Proyecto en Vercel

1. **Import Project**: Seleccionar el repositorio `winbit-backend`
2. **Framework Preset**: Next.js (detectado automáticamente)
3. **Root Directory**: `./` (raíz del proyecto)
4. **Build Command**: `npm run build` (ya configurado)
5. **Output Directory**: `.next` (default)
6. **Install Command**: `npm install` (default)

### 4. Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables, agregar:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NEXTAUTH_SECRET=tu-secret-generado-con-openssl-rand-base64-32
NEXTAUTH_URL=https://tu-proyecto.vercel.app
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

**Nota**: 
- `DATABASE_URL`: Usar la connection string de Supabase (production)
- `NEXTAUTH_SECRET`: Generar uno nuevo: `openssl rand -base64 32`
- `NEXTAUTH_URL`: Se actualizará automáticamente después del primer deploy

### 5. Actualizar Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Editar tu OAuth 2.0 Client ID
4. Agregar a **Authorized redirect URIs**:
   ```
   https://tu-proyecto.vercel.app/api/auth/callback/google
   ```
5. Guardar cambios

### 6. Ejecutar Migraciones

Vercel ejecutará `prisma migrate deploy` automáticamente durante el build (incluido en el script `build`).

Si necesitas ejecutarlas manualmente:

```bash
# Opción A: Desde Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Opción B: Desde Supabase Dashboard
# Ejecutar las migraciones SQL directamente
```

### 7. Deploy

1. Click en **Deploy** en Vercel
2. Esperar a que termine el build
3. Verificar que el deploy fue exitoso
4. Visitar la URL: `https://tu-proyecto.vercel.app`

### 8. Verificar

1. Abrir `https://tu-proyecto.vercel.app`
2. Intentar login con Google
3. Verificar que el dashboard carga correctamente
4. Probar la API pública:
   ```bash
   curl https://tu-proyecto.vercel.app/api/public/wallets
   ```

## Configuración Adicional

### Custom Domain (Opcional)

1. Vercel Dashboard → Settings → Domains
2. Agregar tu dominio personalizado
3. Configurar DNS según las instrucciones de Vercel

### Environment Variables por Entorno

Puedes configurar variables diferentes para:
- **Production**: Variables para producción
- **Preview**: Variables para PRs/previews
- **Development**: Variables para desarrollo local

## Troubleshooting

### Error: "Prisma Client not generated"

**Solución**: El script `postinstall` ya está configurado. Si persiste:
- Verificar que `prisma generate` está en `package.json` → `postinstall`
- Re-deploy en Vercel

### Error: "Database connection failed"

**Solución**:
- Verificar `DATABASE_URL` en Vercel Environment Variables
- Asegurarse de que Supabase permite conexiones desde Vercel (whitelist IPs si es necesario)
- Verificar que la connection string incluye `?sslmode=require`

### Error: "Invalid OAuth callback"

**Solución**:
- Verificar que `NEXTAUTH_URL` en Vercel es `https://tu-proyecto.vercel.app`
- Verificar que el redirect URI en Google Cloud Console coincide exactamente

### Error: "Migration failed"

**Solución**:
- Ejecutar migraciones manualmente desde Supabase Dashboard
- O usar Vercel CLI: `vercel env pull` y luego `npx prisma migrate deploy`

## Alternativas de Hosting

### Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Seleccionar repositorio
4. Railway detecta Next.js automáticamente
5. Configurar variables de entorno
6. Deploy automático

**Ventajas**: 
- Incluye PostgreSQL (no necesitas Supabase)
- Deploy muy simple
- Pricing claro

### Render

1. Crear cuenta en [render.com](https://render.com)
2. New → Web Service
3. Conectar repositorio
4. Configurar:
   - Build Command: `npm run build`
   - Start Command: `npm start`
5. Configurar variables de entorno
6. Deploy

**Ventajas**:
- Gratis para proyectos pequeños
- SSL automático
- Deploy automático desde Git

### Fly.io

1. Instalar Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Launch: `fly launch`
4. Configurar variables: `fly secrets set KEY=value`
5. Deploy: `fly deploy`

**Ventajas**:
- Más control sobre la infraestructura
- Global edge network
- Pricing por uso

## Recomendación Final

**Usar Vercel** porque:
- ✅ Optimizado para Next.js
- ✅ Deploy automático desde Git
- ✅ SSL y CDN incluidos
- ✅ Preview deployments para cada PR
- ✅ Gratis para proyectos pequeños
- ✅ Configuración mínima
- ✅ Excelente documentación

## URLs Post-Deploy

- **App**: `https://tu-proyecto.vercel.app`
- **API Pública**: `https://tu-proyecto.vercel.app/api/public`
- **Dashboard**: `https://tu-proyecto.vercel.app/dashboard`
- **Login**: `https://tu-proyecto.vercel.app/login`

## Próximos Pasos

1. ✅ Deploy a Vercel
2. ⏳ Probar todas las funcionalidades en producción
3. ⏳ Configurar dominio personalizado (opcional)
4. ⏳ Configurar monitoreo/analytics (opcional)
5. ⏳ Conectar winbit-app al backend (cuando esté listo)

