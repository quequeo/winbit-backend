import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { approveRequest, rejectRequest } from './actions';

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string };
}) {
  const requests = await prisma.request.findMany({
    where: {
      ...(searchParams.status && { status: searchParams.status as any }),
      ...(searchParams.type && { type: searchParams.type as any }),
    },
    include: {
      investor: {
        select: {
          name: true,
          email: true,
          code: true,
        },
      },
    },
    orderBy: {
      requestedAt: 'desc',
    },
  });

  const pendingCount = await prisma.request.count({
    where: { status: 'PENDING' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitudes</h1>
          <p className="mt-1 text-sm text-gray-600">
            {pendingCount} solicitud{pendingCount !== 1 ? 'es' : ''} pendiente
            {pendingCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tipo</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2"
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  if (e.target.value) {
                    url.searchParams.set('type', e.target.value);
                  } else {
                    url.searchParams.delete('type');
                  }
                  window.location.href = url.toString();
                }}
              >
                <option value="">Todos</option>
                <option value="DEPOSIT">Depósitos</option>
                <option value="WITHDRAWAL">Retiros</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Estado</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2"
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  if (e.target.value) {
                    url.searchParams.set('status', e.target.value);
                  } else {
                    url.searchParams.delete('status');
                  }
                  window.location.href = url.toString();
                }}
              >
                <option value="">Todos</option>
                <option value="PENDING">Pendientes</option>
                <option value="APPROVED">Aprobados</option>
                <option value="REJECTED">Rechazados</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de solicitudes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No hay solicitudes que coincidan con los filtros.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Inversor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-sm">
                      {new Date(request.requestedAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.investor.name}</p>
                        <p className="text-sm text-gray-500">{request.investor.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          request.type === 'DEPOSIT'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {request.type === 'DEPOSIT' ? 'Depósito' : 'Retiro'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{request.method}</TableCell>
                    <TableCell className="font-mono font-semibold">
                      ${request.amount.toLocaleString('en-US')}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <form action={approveRequest.bind(null, request.id)}>
                            <Button type="submit" size="sm" variant="default">
                              Aprobar
                            </Button>
                          </form>
                          <form action={rejectRequest.bind(null, request.id)}>
                            <Button type="submit" size="sm" variant="destructive">
                              Rechazar
                            </Button>
                          </form>
                        </div>
                      )}
                      {request.status !== 'PENDING' && (
                        <span className="text-sm text-gray-500">
                          {request.processedAt
                            ? new Date(request.processedAt).toLocaleDateString('es-AR')
                            : '-'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

