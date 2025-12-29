'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const portfolioSchema = z.object({
  currentBalance: z.coerce.number().min(0, 'El balance debe ser mayor o igual a 0'),
  totalInvested: z.coerce.number().min(0, 'El total invertido debe ser mayor o igual a 0'),
  accumulatedReturnUSD: z.coerce.number(),
  accumulatedReturnPercent: z.coerce.number(),
  annualReturnUSD: z.coerce.number(),
  annualReturnPercent: z.coerce.number(),
});

export async function updatePortfolio(investorId: string, formData: FormData) {
  const data = portfolioSchema.parse({
    currentBalance: formData.get('currentBalance'),
    totalInvested: formData.get('totalInvested'),
    accumulatedReturnUSD: formData.get('accumulatedReturnUSD'),
    accumulatedReturnPercent: formData.get('accumulatedReturnPercent'),
    annualReturnUSD: formData.get('annualReturnUSD'),
    annualReturnPercent: formData.get('annualReturnPercent'),
  });

  // Verificar que el inversor existe
  const investor = await prisma.investor.findUnique({
    where: { id: investorId },
  });

  if (!investor) {
    throw new Error('Inversor no encontrado');
  }

  // Actualizar o crear el portfolio
  await prisma.portfolio.upsert({
    where: { investorId },
    create: {
      investorId,
      currentBalance: data.currentBalance,
      totalInvested: data.totalInvested,
      accumulatedReturnUSD: data.accumulatedReturnUSD,
      accumulatedReturnPercent: data.accumulatedReturnPercent,
      annualReturnUSD: data.annualReturnUSD,
      annualReturnPercent: data.annualReturnPercent,
    },
    update: {
      currentBalance: data.currentBalance,
      totalInvested: data.totalInvested,
      accumulatedReturnUSD: data.accumulatedReturnUSD,
      accumulatedReturnPercent: data.accumulatedReturnPercent,
      annualReturnUSD: data.annualReturnUSD,
      annualReturnPercent: data.annualReturnPercent,
    },
  });

  revalidatePath('/dashboard/portfolios');
  revalidatePath(`/dashboard/portfolios/${investorId}`);
}

