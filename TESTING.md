# Testing Configuration - Winbit Backend

## ✅ Testing Setup Completado

El backend ahora tiene testing configurado con **Vitest** + **React Testing Library**, siguiendo un estándar similar al PWA (winbit-app), pero adaptado para Next.js App Router.

---

## 📊 Coverage Actual

```
File           | % Stmts | % Branch | % Funcs | % Lines |
---------------|---------|----------|---------|---------|
All files      |   93.33 |    76.92 |   94.73 |   93.1  |
 components/ui |   94.73 |      100 |   94.11 |   94.73 |
 lib           |   90.9  |     62.5 |     100 |   90    |
```

**✅ Todos los tests pasan (28 tests)**

---

## 🎯 Coverage Thresholds

A diferencia del PWA que requiere **97% de coverage**, el backend tiene thresholds más realistas:

- **Lines:** 85% (actual: **93.1%** ✅)
- **Functions:** 80% (actual: **94.73%** ✅)
- **Branches:** 70% (actual: **76.92%** ✅)
- **Statements:** 85% (actual: **93.33%** ✅)

### ¿Por qué no 97% en el backend?

1. **Server Components:** Difíciles de testear en Next.js App Router (requieren mucho mocking)
2. **NextAuth:** La configuración de auth no se testea directamente, se testea su uso
3. **Server Actions:** Se testearán cuando se implementen features reales
4. **API Routes:** Se testearán cuando se creen
5. **Enfoque del backend:** Backoffice interno vs. PWA crítico para usuarios finales

---

## 📁 Tests Creados

### Componentes UI (shadcn/ui)
- ✅ `components/ui/button.test.tsx` (6 tests)
- ✅ `components/ui/input.test.tsx` (5 tests)
- ✅ `components/ui/card.test.tsx` (3 tests)
- ✅ `components/ui/table.test.tsx` (3 tests)

### Lib (Utilidades)
- ✅ `lib/prisma.test.ts` (1 test)
- ✅ `lib/auth.test.ts` (4 tests)

### Páginas (Mocked)
- ✅ `app/(auth)/login/page.test.tsx` (2 tests)
- ✅ `app/(dashboard)/dashboard/page.test.tsx` (4 tests)

**Total:** 8 archivos de test, 28 tests pasando

---

## 🚀 Comandos de Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch (ideal para desarrollo)
npm run test:watch

# Tests con coverage report
npm run test:coverage

# Tests para CI (verbose)
npm run test:ci
```

---

## 📝 Qué NO se testea (y por qué)

Archivos excluidos del coverage:
- `lib/auth.ts` → Configuración de NextAuth (difícil de testear, se testea su uso)
- `middleware.ts` → Middleware de Next.js (se testea integralmente)
- `app/**/layout.tsx` → Server Components con auth (complejo de mockear)
- `app/**/page.tsx` → Server Components (se mockean en tests)
- `app/api/**` → API routes (se testearán cuando se implementen)

---

## 🔄 Diferencias con winbit-app (PWA)

| Aspecto | winbit-app (PWA) | winbit-backend |
|---------|------------------|----------------|
| **Coverage mínimo** | 97% | 85% |
| **Herramienta** | Vitest | Vitest |
| **Enfoque** | Cliente crítico | Backoffice interno |
| **Server Components** | No aplica (Vite) | Excluidos del coverage |
| **Testing de auth** | Firebase Auth | NextAuth (mockeado) |

---

## ✅ Próximos Pasos

Cuando implementes nuevas features:

### 1. Server Actions
Crear tests para mutations:
```typescript
// app/(dashboard)/investors/actions.test.ts
it('creates investor successfully', async () => {
  const result = await createInvestor(formData);
  expect(result.data).toBeDefined();
});
```

### 2. API Routes (para PWA)
Crear tests para endpoints:
```typescript
// app/api/public/investor/[email]/route.test.ts
it('returns investor data with valid token', async () => {
  const response = await GET(request, { params: { email: 'test@test.com' } });
  expect(response.status).toBe(200);
});
```

### 3. Formularios
Cuando crees formularios de CRUD:
```typescript
// components/forms/InvestorForm.test.tsx
it('validates email format', async () => {
  render(<InvestorForm />);
  await user.type(screen.getByLabelText(/email/i), 'invalid');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
```

---

## 🎯 Mantener el Coverage

Para mantener el coverage arriba del 85%:

1. **Cada componente nuevo → crear su test**
2. **Cada utility function → testear con varios inputs**
3. **Cada Server Action → testear success + error cases**
4. **Cada API route → testear auth + responses**

Ejecutá `npm run test:coverage` antes de cada PR.

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing/vitest)

---

**Estado:** ✅ Testing configurado y funcionando con 93.1% coverage

