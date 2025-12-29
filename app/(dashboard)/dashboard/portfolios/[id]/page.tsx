import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { updatePortfolio } from '../actions';
import { formatName } from '@/lib/utils';

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investor = await prisma.investor.findUnique({
    where: { id },
    include: {
      portfolio: true,
    },
  });

  if (!investor) {
    notFound();
  }

  const portfolio = investor.portfolio || {
    currentBalance: 0,
    totalInvested: 0,
    accumulatedReturnUSD: 0,
    accumulatedReturnPercent: 0,
    annualReturnUSD: 0,
    annualReturnPercent: 0,
  };

  async function handleSubmit(formData: FormData) {
    'use server';
    try {
      await updatePortfolio(id, formData);
      redirect('/dashboard/portfolios');
    } catch (error) {
      throw error;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Portfolio</h1>
          <p className="text-gray-600 mt-1">
            {formatName(investor.name)} ({investor.code})
          </p>
        </div>
        <Link href="/dashboard/portfolios">
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Capital Actual */}
              <div className="space-y-2">
                <label htmlFor="currentBalance" className="text-sm font-medium text-gray-700">
                  Capital Actual (USD)
                </label>
                <Input
                  id="currentBalance"
                  name="currentBalance"
                  type="number"
                  step="0.01"
                  defaultValue={portfolio.currentBalance}
                  required
                  className="w-full"
                />
              </div>

              {/* Total Invertido */}
              <div className="space-y-2">
                <label htmlFor="totalInvested" className="text-sm font-medium text-gray-700">
                  Total Invertido (USD)
                </label>
                <Input
                  id="totalInvested"
                  name="totalInvested"
                  type="number"
                  step="0.01"
                  defaultValue={portfolio.totalInvested}
                  required
                  className="w-full"
                />
              </div>

              {/* Rendimiento Acumulado desde el Inicio (USD) */}
              <div className="space-y-2">
                <label
                  htmlFor="accumulatedReturnUSD"
                  className="text-sm font-medium text-gray-700"
                >
                  Rend. Acum. desde el Inicio (USD)
                </label>
                <Input
                  id="accumulatedReturnUSD"
                  name="accumulatedReturnUSD"
                  type="number"
                  step="0.01"
                  defaultValue={portfolio.accumulatedReturnUSD}
                  required
                  className="w-full"
                />
              </div>

              {/* Rendimiento Acumulado desde el Inicio (%) */}
              <div className="space-y-2">
                <label
                  htmlFor="accumulatedReturnPercent"
                  className="text-sm font-medium text-gray-700"
                >
                  R.A. (%)
                </label>
                <Input
                  id="accumulatedReturnPercent"
                  name="accumulatedReturnPercent"
                  type="number"
                  step="0.01"
                  defaultValue={portfolio.accumulatedReturnPercent}
                  required
                  className="w-full"
                />
              </div>

              {/* Rendimiento Acumulado Anual (USD) */}
              <div className="space-y-2">
                <label htmlFor="annualReturnUSD" className="text-sm font-medium text-gray-700">
                  Rend. Acum. Anual (USD)
                </label>
                <Input
                  id="annualReturnUSD"
                  name="annualReturnUSD"
                  type="number"
                  step="0.01"
                  defaultValue={portfolio.annualReturnUSD}
                  required
                  className="w-full"
                />
              </div>

              {/* Rendimiento Acumulado Anual (%) */}
              <div className="space-y-2">
                <label htmlFor="annualReturnPercent" className="text-sm font-medium text-gray-700">
                  R.A.A. (%)
                </label>
                <Input
                  id="annualReturnPercent"
                  name="annualReturnPercent"
                  type="number"
                  step="0.01"
                  defaultValue={portfolio.annualReturnPercent}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/portfolios">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

