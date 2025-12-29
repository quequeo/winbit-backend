# Testing

## Estado

28 tests pasando, 93.1% coverage

```
File           | % Stmts | % Branch | % Funcs | % Lines |
---------------|---------|----------|---------|---------|
All files      |   93.33 |    76.92 |   94.73 |   93.1  |
 components/ui |   94.73 |      100 |   94.11 |   94.73 |
 lib           |   90.9  |     62.5 |     100 |   90    |
```

## Thresholds

- Lines: 85% (actual: 93.1%)
- Functions: 80% (actual: 94.73%)
- Branches: 70% (actual: 76.92%)
- Statements: 85% (actual: 93.33%)

## Tests

- Componentes UI: button, input, card, table
- Lib: prisma, auth
- Páginas: login, dashboard

## Comandos

```bash
npm run test              # Todos los tests
npm run test:watch        # Watch mode
npm run test:coverage     # Con coverage
npm run test:ci          # CI mode
```

## Excluidos del Coverage

- `lib/auth.ts` - Configuración NextAuth
- `middleware.ts` - Middleware Next.js
- `app/**/layout.tsx` - Server Components
- `app/api/**` - API routes (se testearán cuando se implementen)

## Próximos Pasos

- Tests para Server Actions
- Tests para API routes
- Tests para formularios

