'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function approveRequest(requestId: string) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { investor: { include: { portfolio: true } } },
  });

  if (!request) {
    throw new Error('Solicitud no encontrada');
  }

  if (request.status !== 'PENDING') {
    throw new Error('Solo se pueden aprobar solicitudes pendientes');
  }

  if (!request.investor.portfolio) {
    throw new Error('El inversor no tiene un portfolio');
  }

  const portfolio = request.investor.portfolio;
  const previousBalance = portfolio.currentBalance;
  let newBalance: number;

  // Calcular nuevo balance
  if (request.type === 'DEPOSIT') {
    newBalance = previousBalance + request.amount;
  } else {
    // WITHDRAWAL
    if (previousBalance < request.amount) {
      throw new Error('Balance insuficiente para realizar el retiro');
    }
    newBalance = previousBalance - request.amount;
  }

  // Actualizar en una transacción
  await prisma.$transaction([
    // Actualizar el portfolio
    prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        currentBalance: newBalance,
        totalInvested:
          request.type === 'DEPOSIT'
            ? portfolio.totalInvested + request.amount
            : portfolio.totalInvested,
      },
    }),

    // Actualizar la solicitud
    prisma.request.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
      },
    }),

    // Crear entrada en el historial
    prisma.portfolioHistory.create({
      data: {
        investorId: request.investorId,
        event: request.type === 'DEPOSIT' ? 'Depósito' : 'Retiro',
        amount: request.amount,
        previousBalance,
        newBalance,
        status: 'COMPLETED',
      },
    }),
  ]);

  revalidatePath('/requests');
  revalidatePath('/dashboard');
  revalidatePath(`/investors/${request.investorId}`);
}

export async function rejectRequest(requestId: string) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error('Solicitud no encontrada');
  }

  if (request.status !== 'PENDING') {
    throw new Error('Solo se pueden rechazar solicitudes pendientes');
  }

  await prisma.request.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      processedAt: new Date(),
      notes: 'Rechazado por el administrador',
    },
  });

  revalidatePath('/requests');
  revalidatePath('/dashboard');
  revalidatePath(`/investors/${request.investorId}`);
}

