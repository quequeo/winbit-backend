# Demo - Winbit Backend

## Features Implementadas

### 1. **Gestión de Inversores** (`/investors`)
- ✅ Lista de inversores con tabla
- ✅ Ver detalle de inversor individual
- ✅ Crear nuevo inversor
- ✅ Activar/Desactivar inversor
- ✅ Ver portfolio, historial y solicitudes del inversor

### 2. **Gestión de Solicitudes** (`/requests`)
- ✅ Lista de solicitudes (depósitos y retiros)
- ✅ Filtros por tipo y estado
- ✅ Aprobar solicitudes (actualiza balance automáticamente)
- ✅ Rechazar solicitudes
- ✅ Registro automático en historial al aprobar

### 3. **Api Pública para PWA**
- ✅ `GET /api/public/investor/:email` - Datos del inversor
- ✅ `GET /api/public/investor/:email/history` - Historial
- ✅ `GET /api/public/wallets` - Wallets habilitadas
- ✅ `POST /api/public/requests` - Crear solicitud

### 4. **Dashboard**
- ✅ Total inversores
- ✅ AUM (Assets Under Management)
- ✅ Solicitudes pendientes
- ✅ Navegación entre secciones

## Cómo Probar

1. Iniciar servidor: `npm run dev`
2. Abrir http://localhost:3000
3. Login con Google
4. Navegar: Dashboard, Inversores, Solicitudes

## Crear Datos de Prueba

**Opción A: UI del backend**
- Ir a `/investors` → "Agregar Inversor"
- Llenar: código, nombre, email

**Opción B: Prisma Studio**
```bash
npx prisma studio
```
- Agregar inversor en tabla `Investor`
- Agregar solicitud en tabla `Request` (status: `PENDING`)
- Ir a `/requests` y aprobarla

## Api Pública (PWA)

Base URL: `http://localhost:3000/api/public`

### Endpoints

**GET /investor/:email** - Datos del inversor + portfolio
```bash
curl http://localhost:3000/api/public/investor/test@example.com
```

**GET /investor/:email/history** - Historial completo
```bash
curl http://localhost:3000/api/public/investor/test@example.com/history
```

**GET /wallets** - Wallets habilitadas
```bash
curl http://localhost:3000/api/public/wallets
```

**POST /requests** - Crear solicitud
```bash
curl -X POST http://localhost:3000/api/public/requests \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","type":"WITHDRAWAL","amount":5000,"method":"USDT"}'
```

## Guion para Chueco

1. **Login** - Google OAuth, rápido y seguro
2. **Dashboard** - Resumen: inversores, AUM, solicitudes pendientes
3. **Inversores** - Lista completa, ver detalle (balance, retornos, historial)
4. **Agregar Inversor** - Formulario simple (código, nombre, email)
5. **Solicitudes** - Aprobar/rechazar con 1 click, balance se actualiza automáticamente
6. **Historial** - Todo queda registrado automáticamente
7. **Comparación** - Antes: editar Google Sheets manualmente. Ahora: 1 click, todo automático

## Conectar PWA

Actualizar `winbit-app/src/services/sheets.js`:

**Antes:**
```javascript
const response = await fetch(`https://sheets.googleapis.com/...`);
```

**Después:**
```javascript
const response = await fetch(`http://localhost:3000/api/public/investor/${email}`);
```

Para solicitudes:
```javascript
POST http://localhost:3000/api/public/requests
```

## Ventajas

- **Automatización**: Aprobaciones con 1 click, balance se actualiza automáticamente
- **Trazabilidad**: Historial completo, todo registrado
- **Escalabilidad**: Fácil agregar más inversores y features
- **Seguridad**: Base de datos segura, autenticación Google
- **Tiempo**: 5-10 min → 5 segundos por solicitud

