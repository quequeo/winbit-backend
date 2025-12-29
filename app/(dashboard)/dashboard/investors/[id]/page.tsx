import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toggleInvestorStatus } from '../actions';
import { formatName } from '@/lib/utils';

export default async function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investor = await prisma.investor.findUnique({
    where: { id },
    include: {
      portfolio: true,
      portfolioHistory: {
        orderBy: { date: 'desc' },
        take: 10,
      },
      requests: {
        orderBy: { requestedAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!investor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Detalle del Inversor</h1>
        <div className="flex gap-2">
          <form action={toggleInvestorStatus.bind(null, investor.id)}>
            <Button
              type="submit"
              variant={investor.status === 'ACTIVE' ? 'outline' : 'default'}
            >
              {investor.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
            </Button>
          </form>
          <Link href="/dashboard/investors">
            <Button variant="outline">Volver</Button>
          </Link>
        </div>
      </div>

      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Código</p>
              <p className="font-mono text-lg">{investor.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estado</p>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  investor.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {investor.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p className="text-lg">{formatName(investor.name)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{investor.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          {investor.portfolio ? (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Balance Actual</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${investor.portfolio.currentBalance.toLocaleString('en-US')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Invertido</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${investor.portfolio.totalInvested.toLocaleString('en-US')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Retorno Acumulado</p>
                <p className="text-2xl font-bold text-green-600">
                  ${investor.portfolio.accumulatedReturnUSD.toLocaleString('en-US')}{' '}
                  <span className="text-base">
                    ({investor.portfolio.accumulatedReturnPercent.toFixed(2)}%)
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos de portfolio</p>
          )}
        </CardContent>
      </Card>

      {/* Historial reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Historial Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {investor.portfolioHistory.length === 0 ? (
            <p className="text-gray-500">No hay movimientos registrados</p>
          ) : (
            <div className="space-y-3">
              {investor.portfolioHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{entry.event}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold">
                      ${entry.amount.toLocaleString('en-US')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Nuevo: ${entry.newBalance.toLocaleString('en-US')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solicitudes recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {investor.requests.length === 0 ? (
            <p className="text-gray-500">No hay solicitudes</p>
          ) : (
            <div className="space-y-3">
              {investor.requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {request.type === 'DEPOSIT' ? 'Depósito' : 'Retiro'} - {request.method}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(request.requestedAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold">
                      ${request.amount.toLocaleString('en-US')}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        request.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status === 'PENDING'
                        ? 'Pendiente'
                        : request.status === 'APPROVED'
                          ? 'Aprobado'
                          : 'Rechazado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

