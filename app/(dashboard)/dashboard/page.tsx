import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const [investorCount, pendingRequestCount] = await Promise.all([
    prisma.investor.count({ where: { status: 'ACTIVE' } }),
    prisma.request.count({ where: { status: 'PENDING' } }),
  ]);

  const totalAUM = await prisma.portfolio.aggregate({
    _sum: { currentBalance: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm font-medium text-gray-600">Total Inversores</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {investorCount}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm font-medium text-gray-600">AUM Total</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${totalAUM._sum.currentBalance?.toLocaleString('en-US') ?? '0'}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm font-medium text-gray-600">
            Solicitudes Pendientes
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {pendingRequestCount}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Próximos pasos
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ Proyecto inicializado con Next.js + Prisma</li>
          <li>✅ Autenticación con Google OAuth configurada</li>
          <li>✅ Base de datos con modelos definidos</li>
          <li>⏳ Configurar base de datos (Supabase o Vercel Postgres)</li>
          <li>⏳ Implementar CRUD de inversores</li>
          <li>⏳ Implementar gestión de solicitudes</li>
          <li>⏳ Crear API pública para PWA</li>
        </ul>
      </div>
    </div>
  );
}

