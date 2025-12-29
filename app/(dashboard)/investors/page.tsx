import { prisma } from '@/lib/prisma';
import Link from 'next/link';
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

export default async function InvestorsPage() {
  const investors = await prisma.investor.findMany({
    include: {
      portfolio: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inversores</h1>
        <Link href="/investors/new">
          <Button>Agregar Inversor</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Inversores</CardTitle>
        </CardHeader>
        <CardContent>
          {investors.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No hay inversores registrados. Agregá el primero.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investors.map((investor) => (
                  <TableRow key={investor.id}>
                    <TableCell className="font-mono">{investor.code}</TableCell>
                    <TableCell className="font-medium">{investor.name}</TableCell>
                    <TableCell className="text-gray-600">{investor.email}</TableCell>
                    <TableCell>
                      ${investor.portfolio?.currentBalance?.toLocaleString('en-US') ?? '0'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          investor.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {investor.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/investors/${investor.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
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

