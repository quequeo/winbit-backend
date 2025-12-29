# Estado del Proyecto

**Fecha:** 29 de diciembre de 2024  
**Servidor:** http://localhost:3000  
**Estado:** Funcional - Listo para demo

## Features Implementadas

### Base de Datos
- Supabase PostgreSQL conectada
- Migraciones aplicadas
- Tablas: User, Investor, Portfolio, PortfolioHistory, Wallet, Request

### Funcionalidades
- **Inversores** (`/investors`): Lista, crear, ver detalle, activar/desactivar
- **Solicitudes** (`/requests`): Lista con filtros, aprobar/rechazar, actualización automática de balance
- **Api Pública** (`/api/public/*`): 4 endpoints para PWA
- **Dashboard**: Métricas en tiempo real (inversores, AUM, solicitudes pendientes)
- **Tests**: 28 tests pasando (93.1% coverage)

## Probar

1. Abrir http://localhost:3000
2. Login con Google
3. Navegar: Dashboard, Inversores, Solicitudes

### Crear datos de prueba

```bash
npx prisma studio
```

Agregar inversor manualmente, luego crear solicitud y aprobarla.

### Probar API

```bash
# Datos del inversor
curl http://localhost:3000/api/public/investor/test@example.com

# Historial
curl http://localhost:3000/api/public/investor/test@example.com/history

# Crear solicitud
curl -X POST http://localhost:3000/api/public/requests \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","type":"WITHDRAWAL","amount":1000,"method":"USDT"}'
```

## Próximos Pasos

- Migrar datos desde Google Sheets
- Conectar winbit-app al backend
- Implementar autenticación Firebase en Api
- Deploy a producción

