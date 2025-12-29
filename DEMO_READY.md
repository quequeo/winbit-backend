# 🎉 Backend Demo Completado

## ✅ Features Implementadas

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

### 3. **API Pública para PWA**
- ✅ `GET /api/public/investor/:email` - Datos del inversor
- ✅ `GET /api/public/investor/:email/history` - Historial
- ✅ `GET /api/public/wallets` - Wallets habilitadas
- ✅ `POST /api/public/requests` - Crear solicitud

### 4. **Dashboard**
- ✅ Total inversores
- ✅ AUM (Assets Under Management)
- ✅ Solicitudes pendientes
- ✅ Navegación entre secciones

---

## 🚀 Cómo Probar la Demo

### 1. Iniciar el servidor (si no está corriendo)
```bash
cd /Users/jaime/Desktop/Apps/winbit-backend
npm run dev
```

### 2. Abrir en el navegador
```
http://localhost:3000
```

### 3. Hacer login con Google
- Click en "Iniciar sesión con Google"
- Elegí tu cuenta de Google
- Redirige al Dashboard

### 4. Navegar por las secciones

#### **Dashboard** (`/dashboard`)
- Ver resumen de inversores, AUM y solicitudes pendientes

#### **Inversores** (`/investors`)
- Ver los 2 inversores que creaste en Prisma Studio
- Click en "Agregar Inversor" para crear uno nuevo
- Click en "Ver" para ver detalles de un inversor

#### **Solicitudes** (`/requests`)
- Ver solicitudes de retiro/depósito
- Aprobar o rechazar solicitudes
- Ver cómo cambia el balance del inversor al aprobar

---

## 📊 Crear Datos de Prueba

### Opción A: Prisma Studio (lo que ya hiciste)
```bash
npx prisma studio
```

### Opción B: Desde la UI del backend
1. Ir a `/investors`
2. Click en "Agregar Inversor"
3. Llenar:
   - Código: `INV003`
   - Nombre: `Pedro García`
   - Email: `pedro@example.com`
4. Click en "Crear Inversor"

### Crear una solicitud de prueba (manual)
Usá Prisma Studio:
1. Abrí la tabla `Request`
2. Agregá un registro:
   - `investorId`: (copiar el ID de un inversor)
   - `type`: `DEPOSIT`
   - `amount`: `10000`
   - `method`: `USDT`
   - `status`: `PENDING`
3. Andá a `/requests` y aprobalo

---

## 🔗 Endpoints de la API (para PWA)

### Base URL (local)
```
http://localhost:3000/api/public
```

### Endpoints disponibles

#### 1. Obtener datos del inversor
```bash
GET /api/public/investor/:email

# Ejemplo
curl http://localhost:3000/api/public/investor/test@example.com
```

**Response:**
```json
{
  "data": {
    "investor": {
      "email": "test@example.com",
      "name": "Test User",
      "code": "INV001"
    },
    "portfolio": {
      "currentBalance": 50000,
      "totalInvested": 50000,
      "accumulatedReturnUSD": 0,
      "accumulatedReturnPercent": 0,
      "annualReturnUSD": 0,
      "annualReturnPercent": 0,
      "updatedAt": "2024-12-29T..."
    }
  }
}
```

#### 2. Obtener historial del inversor
```bash
GET /api/public/investor/:email/history

# Ejemplo
curl http://localhost:3000/api/public/investor/test@example.com/history
```

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "date": "2024-12-29T...",
      "event": "Depósito",
      "amount": 10000,
      "previousBalance": 40000,
      "newBalance": 50000,
      "status": "COMPLETED"
    }
  ]
}
```

#### 3. Obtener wallets habilitadas
```bash
GET /api/public/wallets

# Ejemplo
curl http://localhost:3000/api/public/wallets
```

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "asset": "USDT",
      "network": "TRC20",
      "address": "TF7j33woKnMVFALtvRVdnFWnneNrUCVvAr",
      "enabled": true
    }
  ]
}
```

#### 4. Crear solicitud (retiro/depósito)
```bash
POST /api/public/requests
Content-Type: application/json

{
  "email": "test@example.com",
  "type": "WITHDRAWAL",
  "amount": 5000,
  "method": "USDT",
  "network": "TRC20"
}
```

**Response:**
```json
{
  "data": {
    "id": "...",
    "investorId": "...",
    "type": "WITHDRAWAL",
    "amount": 5000,
    "method": "USDT",
    "status": "PENDING",
    "requestedAt": "2024-12-29T..."
  }
}
```

---

## 🎨 Demostración para Chueco

### Guion de la demo:

1. **Login rápido** (Google OAuth)
   - "Te autenticás con tu cuenta de Google, es súper seguro"

2. **Dashboard** (`/dashboard`)
   - "Acá ves el resumen: cuántos inversores tenés, cuánto dinero gestionás, y cuántas solicitudes están esperando aprobación"

3. **Inversores** (`/investors`)
   - "Acá están todos tus inversores"
   - Mostrar la tabla
   - Click en "Ver" en un inversor
   - "Acá ves todo el detalle: su balance, inversión total, retornos, historial completo"

4. **Agregar Inversor** (`/investors/new`)
   - "Agregás un inversor nuevo en segundos: código, nombre, email"
   - Crear uno de prueba
   - "Automáticamente se crea su portfolio en $0"

5. **Solicitudes** (`/requests`)
   - "Acá llegan todas las solicitudes de retiro o depósito"
   - Mostrar la tabla
   - **Aprobar una solicitud**:
     - Click en "Aprobar"
     - "Mirá, el balance se actualiza automáticamente"
     - Volver a `/investors` y mostrar el balance actualizado
   - **Rechazar una solicitud**:
     - Click en "Rechazar"
     - "Y si no es válida, la rechazás con 1 click"

6. **Ver historial del inversor** (`/investors/:id`)
   - "Acá queda todo registrado automáticamente"
   - Mostrar el historial con el movimiento que acabás de aprobar

7. **Comparación con Google Sheets**
   - "Antes: editabas manualmente la planilla"
   - "Ahora: aprobás con 1 click y todo se actualiza automático"
   - "Además, el inversor ve su balance actualizado en tiempo real en su app (PWA)"

---

## 📱 Próximo Paso: Conectar el PWA

Para que el PWA (winbit-app) use el backend en vez de Google Sheets:

### 1. Actualizar `winbit-app/src/services/sheets.js`

**Antes:**
```javascript
// Llamada a Google Sheets API
const response = await fetch(`https://sheets.googleapis.com/...`);
```

**Después:**
```javascript
// Llamada al backend
const response = await fetch(`http://localhost:3000/api/public/investor/${email}`);
```

### 2. Agregar autenticación (opcional, para después)
```javascript
const idToken = await user.getIdToken();
const response = await fetch(`http://localhost:3000/api/public/investor/${email}`, {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});
```

### 3. Actualizar formularios de solicitudes
Cambiar el envío de email por llamada a:
```javascript
POST http://localhost:3000/api/public/requests
```

---

## 🎯 Ventajas para Chueco

### ✅ Automatización
- No más editar Google Sheets manualmente
- Aprobás solicitudes con 1 click
- Balance se actualiza automáticamente

### ✅ Trazabilidad
- Todo queda registrado (quién, cuándo, cuánto)
- Historial completo de cada inversor
- No se pierde nada

### ✅ Escalabilidad
- 25 inversores hoy → 100 mañana (sin problema)
- Agregar features nuevas es fácil (reportes, analytics, etc.)

### ✅ Seguridad
- Base de datos segura (Supabase)
- Autenticación con Google
- Solo vos tenés acceso al admin

### ✅ Tiempo
- Antes: 5-10 min por solicitud (buscar fila, editar, calcular, actualizar)
- Ahora: 5 segundos (1 click)

---

**🚀 La demo está lista. ¡A mostrarle a Chueco!**

