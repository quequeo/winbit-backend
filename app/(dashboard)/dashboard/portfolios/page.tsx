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
import { formatName } from '@/lib/utils';

export default async function PortfoliosPage() {
  const investors = await prisma.investor.findMany({
    include: {
      portfolio: true,
    },
    where: {
      status: 'ACTIVE',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolios</h1>
          <p className="text-gray-600 mt-1">
            Haz clic en "Editar Portfolio" para modificar los datos de inversión de cada inversor
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inversiones de Inversores</CardTitle>
        </CardHeader>
        <CardContent>
          {investors.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No hay inversores activos. Agregá inversores desde la sección de Inversores.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Capital Actual</TableHead>
                    <TableHead className="text-right">Total Invertido</TableHead>
                    <TableHead className="text-right">Rend. Acum. USD</TableHead>
                    <TableHead className="text-right">R.A. %</TableHead>
                    <TableHead className="text-right">Rend. Anual USD</TableHead>
                    <TableHead className="text-right">R.A.A. %</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investors.map((investor) => (
                    <TableRow key={investor.id}>
                      <TableCell className="font-mono">{investor.code}</TableCell>
                      <TableCell className="font-medium">
                        {formatName(investor.name)}
                      </TableCell>
                      <TableCell className="text-gray-600">{investor.email}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${investor.portfolio?.currentBalance?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? '0.00'}
                      </TableCell>
                      <TableCell className="text-right">
                        ${investor.portfolio?.totalInvested?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? '0.00'}
                      </TableCell>
                      <TableCell className="text-right">
                        {investor.portfolio?.accumulatedReturnUSD &&
                        investor.portfolio.accumulatedReturnUSD >= 0
                          ? '+'
                          : ''}
                        ${investor.portfolio?.accumulatedReturnUSD?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? '0.00'}
                      </TableCell>
                      <TableCell className="text-right">
                        {investor.portfolio?.accumulatedReturnPercent &&
                        investor.portfolio.accumulatedReturnPercent >= 0
                          ? '+'
                          : ''}
                        {investor.portfolio?.accumulatedReturnPercent?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? '0.00'}
                        %
                      </TableCell>
                      <TableCell className="text-right">
                        {investor.portfolio?.annualReturnUSD &&
                        investor.portfolio.annualReturnUSD >= 0
                          ? '+'
                          : ''}
                        ${investor.portfolio?.annualReturnUSD?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? '0.00'}
                      </TableCell>
                      <TableCell className="text-right">
                        {investor.portfolio?.annualReturnPercent &&
                        investor.portfolio.annualReturnPercent >= 0
                          ? '+'
                          : ''}
                        {investor.portfolio?.annualReturnPercent?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? '0.00'}
                        %
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/portfolios/${investor.id}`}>
                          <Button size="sm">
                            Editar Portfolio
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

