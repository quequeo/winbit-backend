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
2. **Framework Preset**: Next.js (detectado automáticamente) - **NO cambiar esto**
3. **Root Directory**: `./` (raíz del proyecto)
4. **Build Command**: Dejar vacío (Vercel usa `npm run build` automáticamente)
5. **Output Directory**: Dejar vacío (Vercel detecta `.next` automáticamente)
6. **Install Command**: Dejar vacío (Vercel usa `npm install` automáticamente)

**Importante**: No crear `vercel.json` ni sobrescribir estas configuraciones. Vercel detecta Next.js automáticamente y las configura correctamente.

### 4. Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables, agregar:

#### Obtener URLs de Supabase

1. Ir a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Settings → Database
3. En "Connection string", seleccionar:
   - **Connection pooling** → **Session mode** → Copiar la URL (para `DATABASE_URL`)
   - **Direct connection** → Copiar la URL (para `DIRECT_URL` - solo para migraciones)

**Formato esperado:**
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
```

#### Variables a Configurar en Vercel

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require
NEXTAUTH_SECRET=tu-secret-generado-con-openssl-rand-base64-32
NEXTAUTH_URL=https://tu-proyecto.vercel.app
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
GOOGLE_SHEETS_ID=tu-google-sheets-id
GOOGLE_SHEETS_API_KEY=tu-google-sheets-api-key
RESEND_API_KEY=re_xxxxxxxxxxxxx (opcional, para emails)
RESEND_FROM_EMAIL=Winbit <noreply@tudominio.com> (opcional)
```

**Importante:**
- `DATABASE_URL`: Usar la URL de **Connection pooling** (Session mode) - puerto **6543**
- `DIRECT_URL`: Usar la URL de **Direct connection** - puerto **5432** (solo para migraciones)
- Si tu password tiene caracteres especiales, asegúrate de que estén URL-encoded en la string
- `NEXTAUTH_SECRET`: Generar uno nuevo: `openssl rand -base64 32`
- `NEXTAUTH_URL`: Se actualizará automáticamente después del primer deploy
- `GOOGLE_SHEETS_ID`: ID de la planilla de Google Sheets (obtener de la URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`)
- `GOOGLE_SHEETS_API_KEY`: API Key de Google Sheets (crear en [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create Credentials → API Key)
- `RESEND_API_KEY`: (Opcional) API Key de Resend para enviar emails. Crear en [resend.com](https://resend.com/api-keys). Si no se configura, los emails no se enviarán pero el sistema seguirá funcionando.
- `RESEND_FROM_EMAIL`: (Opcional) Email desde el cual se enviarán los correos. Formato: `Nombre <email@dominio.com>`. **NO puede ser Gmail**. Usar dominio verificado en Resend o dejar vacío para usar `onboarding@resend.dev` (solo desarrollo).

**Troubleshooting URL:**
- Si la URL tiene espacios, elimínalos
- Si tiene caracteres especiales (`@`, `:`, `/`, `?`, `#`, `[`, `]`), deben estar URL-encoded
- Ejemplo: `@` → `%40`, `:` → `%3A`, `/` → `%2F`
- O mejor: copiar directamente desde Supabase sin modificar

### 5. Configurar Resend (Opcional - para emails)

Si querés que se envíen emails automáticamente cuando se aprueban depósitos:

1. Crear cuenta en [Resend](https://resend.com) (gratis hasta 3,000 emails/mes)
2. Ir a [API Keys](https://resend.com/api-keys) → Create API Key
3. Copiar la API Key → Agregar como `RESEND_API_KEY` en Vercel

**Configurar el email remitente:**

**Opción A: Usar dominio de prueba (rápido, solo para desarrollo)**
- No configures `RESEND_FROM_EMAIL` o usa: `Winbit <onboarding@resend.dev>`
- ⚠️ Los emails pueden ir a spam y solo funcionan para desarrollo

**Opción B: Verificar tu propio dominio (recomendado para producción)**
1. Ir a [Resend → Domains](https://resend.com/domains)
2. Click en "Add Domain"
3. Ingresar tu dominio (ej: `winbit.com`)
4. Agregar los registros DNS que Resend te indique
5. Esperar verificación (puede tardar unos minutos)
6. Configurar `RESEND_FROM_EMAIL` en formato: `Winbit <noreply@tudominio.com>`

**⚠️ Importante**: Resend NO permite usar Gmail (`@gmail.com`) como remitente. Debes usar un dominio propio o el dominio de prueba.

**Nota**: Si no configurás Resend, el sistema funcionará normalmente pero no enviará emails. Los emails se loguearán en la consola en desarrollo.

### 6. Actualizar Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Editar tu OAuth 2.0 Client ID
4. Agregar a **Authorized redirect URIs** (agregar AMBAS URLs):
   ```
   https://tu-proyecto.vercel.app/api/auth/callback/google
   https://tu-proyecto-[hash]-[usuario].vercel.app/api/auth/callback/google
   ```
   **Nota**: Vercel puede usar la URL del deployment específico, así que es mejor agregar ambas.
5. Guardar cambios
6. **Importante**: Esperar 1-2 minutos para que los cambios se propaguen

### 7. Ejecutar Migraciones

**Primera vez**: Ejecutar las migraciones manualmente antes del primer deploy:

```bash
# Opción A: Desde tu máquina local
# Configurar DATABASE_URL y DIRECT_URL en .env.local
npx prisma migrate deploy

# Opción B: Desde Supabase Dashboard
# Ejecutar las migraciones SQL directamente desde prisma/migrations/
```

**Después del deploy**: Las migraciones se ejecutarán automáticamente si agregas un Build Hook o las ejecutas manualmente cuando sea necesario.

**Nota**: El script de build genera Prisma Client pero NO ejecuta migraciones automáticamente para evitar que el build falle si hay problemas de conexión.

### 8. Deploy

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

### Error: "Database connection failed" o "invalid port number"

**Solución**:
- Verificar que `DATABASE_URL` usa el puerto **6543** (Connection pooling)
- Verificar que `DIRECT_URL` usa el puerto **5432** (Direct connection)
- Asegurarse de copiar la URL completa desde Supabase sin modificar
- Si el password tiene caracteres especiales, verificar que estén correctamente en la URL
- Verificar que no hay espacios al inicio/final de la URL en Vercel
- Asegurarse de que Supabase permite conexiones desde Vercel (whitelist IPs si es necesario)
- Verificar que la connection string incluye `?sslmode=require`
- **Pro tip**: Copiar la URL directamente desde Supabase Dashboard sin editar manualmente

### Error: "routes-manifest.json couldn't be found" o "The file `.next`/routes-manifest.json couldn't be found"

**Solución**:
- **Eliminar `vercel.json`** si existe (Vercel detecta Next.js automáticamente)
- Verificar que el build se completa correctamente (revisar logs de build)
- Asegurarse de que no hay errores en el script de build
- En Vercel Dashboard → Settings → General, verificar:
  - Framework Preset: **Next.js** (no cambiar)
  - Build Command: **vacío** (dejar que Vercel use el default)
  - Output Directory: **vacío** (dejar que Vercel detecte `.next`)
- Si el build falla por Prisma, verificar que `DATABASE_URL` y `DIRECT_URL` están configuradas
- Re-deploy después de hacer estos cambios

### Error: "Invalid OAuth callback" o "redirect_uri_mismatch"

**Solución**:
- Verificar que `NEXTAUTH_URL` en Vercel es exactamente `https://tu-proyecto.vercel.app` (sin trailing slash `/`)
- Verificar que el redirect URI en Google Cloud Console coincide exactamente
- Agregar AMBAS URLs en Google Cloud Console:
  - `https://tu-proyecto.vercel.app/api/auth/callback/google`
  - `https://tu-proyecto-[hash]-[usuario].vercel.app/api/auth/callback/google`
- Esperar 1-2 minutos después de guardar cambios en Google Cloud Console
- Hacer re-deploy en Vercel después de actualizar `NEXTAUTH_URL`
- Verificar que no hay espacios o caracteres especiales en `NEXTAUTH_URL`

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

