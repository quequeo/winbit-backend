import { prisma } from '@/lib/prisma';
import { getDashboardSheetData } from '@/lib/sheets';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function DashboardPage() {
  const [investorCount, pendingRequestCount, sheetData] = await Promise.all([
    prisma.investor.count({ where: { status: 'ACTIVE' } }),
    prisma.request.count({ where: { status: 'PENDING' } }),
    getDashboardSheetData(),
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

      {/* Tabla de Google Sheets - Solapa DASHBOARD */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Datos de Google Sheets - DASHBOARD
        </h2>
        {sheetData.error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p className="font-medium">Error al cargar datos:</p>
            <p className="text-sm">{sheetData.error}</p>
          </div>
        ) : sheetData.headers.length === 0 ? (
          <p className="text-gray-600">No hay datos disponibles</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {sheetData.headers.map((header, index) => (
                    <TableHead key={index} className="font-semibold">
                      {header || `Columna ${index + 1}`}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sheetData.rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={sheetData.headers.length}
                      className="text-center text-gray-500"
                    >
                      No hay filas de datos
                    </TableCell>
                  </TableRow>
                ) : (
                  sheetData.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {sheetData.headers.map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          {row[colIndex] || '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

