'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const investorSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
});

export async function createInvestor(formData: FormData) {
  const data = investorSchema.parse({
    email: formData.get('email'),
    name: formData.get('name'),
    code: formData.get('code'),
  });

  // Verificar si ya existe un inversor con ese email o código
  const existingInvestor = await prisma.investor.findFirst({
    where: {
      OR: [{ email: data.email }, { code: data.code }],
    },
  });

  if (existingInvestor) {
    if (existingInvestor.email === data.email) {
      throw new Error('Ya existe un inversor con ese email');
    }
    throw new Error('Ya existe un inversor con ese código');
  }

  // Crear el inversor
  const investor = await prisma.investor.create({
    data: {
      email: data.email,
      name: data.name,
      code: data.code,
      status: 'ACTIVE',
    },
  });

  // Crear el portfolio inicial
  await prisma.portfolio.create({
    data: {
      investorId: investor.id,
      currentBalance: 0,
      totalInvested: 0,
      accumulatedReturnUSD: 0,
      accumulatedReturnPercent: 0,
      annualReturnUSD: 0,
      annualReturnPercent: 0,
    },
  });

  revalidatePath('/dashboard/investors');
  redirect('/dashboard/investors');
}

export async function updateInvestor(id: string, formData: FormData) {
  const data = investorSchema.parse({
    email: formData.get('email'),
    name: formData.get('name'),
    code: formData.get('code'),
  });

  // Verificar si ya existe otro inversor con ese email o código
  const existingInvestor = await prisma.investor.findFirst({
    where: {
      OR: [{ email: data.email }, { code: data.code }],
      NOT: { id },
    },
  });

  if (existingInvestor) {
    if (existingInvestor.email === data.email) {
      throw new Error('Ya existe otro inversor con ese email');
    }
    throw new Error('Ya existe otro inversor con ese código');
  }

  await prisma.investor.update({
    where: { id },
    data: {
      email: data.email,
      name: data.name,
      code: data.code,
    },
  });

  revalidatePath('/dashboard/investors');
  revalidatePath(`/dashboard/investors/${id}`);
  redirect('/dashboard/investors');
}

export async function toggleInvestorStatus(id: string) {
  const investor = await prisma.investor.findUnique({
    where: { id },
  });

  if (!investor) {
    throw new Error('Inversor no encontrado');
  }

  await prisma.investor.update({
    where: { id },
    data: {
      status: investor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
    },
  });

  revalidatePath('/dashboard/investors');
  revalidatePath(`/dashboard/investors/${id}`);
}

