import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestsByTypeChart } from '@/components/charts/RequestsByTypeChart';
import { TopInvestorsChart } from '@/components/charts/TopInvestorsChart';
import { RequestsOverTimeChart } from '@/components/charts/RequestsOverTimeChart';
import { formatName } from '@/lib/utils';

export default async function DashboardPage() {
  const [
    investorCount,
    pendingRequestCount,
    totalAUM,
    depositCount,
    withdrawalCount,
    topInvestors,
  ] = await Promise.all([
    prisma.investor.count({ where: { status: 'ACTIVE' } }),
    prisma.request.count({ where: { status: 'PENDING' } }),
    prisma.portfolio.aggregate({
      _sum: { currentBalance: true },
    }),
    prisma.request.count({ where: { type: 'DEPOSIT' } }),
    prisma.request.count({ where: { type: 'WITHDRAWAL' } }),
    // Top 5 inversores por balance
    prisma.investor.findMany({
      where: { status: 'ACTIVE' },
      include: { portfolio: true },
      take: 100, // Obtener más para luego ordenar y tomar top 5
    }),
  ]);

  // Preparar datos para gráfico de solicitudes por mes
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: date.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }),
      startDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 1),
    };
  });

  const requestsData = await Promise.all(
    last6Months.map(async ({ month, startDate, endDate }) => {
      const [deposits, withdrawals] = await Promise.all([
        prisma.request.count({
          where: {
            type: 'DEPOSIT',
            requestedAt: {
              gte: startDate,
              lt: endDate,
            },
          },
        }),
        prisma.request.count({
          where: {
            type: 'WITHDRAWAL',
            requestedAt: {
              gte: startDate,
              lt: endDate,
            },
          },
        }),
      ]);
      return { month, deposits, withdrawals };
    })
  );

  const topInvestorsData = topInvestors
    .filter((inv) => inv.portfolio)
    .sort((a, b) => (b.portfolio!.currentBalance || 0) - (a.portfolio!.currentBalance || 0))
    .slice(0, 5)
    .map((investor) => ({
      name: formatName(investor.name).split(' ')[0], // Solo primer nombre para el gráfico
      balance: investor.portfolio!.currentBalance,
    }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Inversores</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {investorCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Capital Total</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              ${totalAUM._sum.currentBalance?.toLocaleString('en-US') ?? '0'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Total de activos bajo gestión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">
              Solicitudes Pendientes
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {pendingRequestCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestsByTypeChart
              depositCount={depositCount}
              withdrawalCount={withdrawalCount}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Inversores por Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {topInvestorsData.length > 0 ? (
              <TopInvestorsChart data={topInvestorsData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes por Mes (Últimos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestsOverTimeChart data={requestsData} />
        </CardContent>
      </Card>
    </div>
  );
}

