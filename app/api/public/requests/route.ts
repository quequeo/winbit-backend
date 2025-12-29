import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  email: z.string().email(),
  type: z.enum(['DEPOSIT', 'WITHDRAWAL']),
  amount: z.number().positive(),
  method: z.enum(['USDT', 'USDC', 'LEMON_CASH', 'CASH', 'SWIFT']),
  network: z.enum(['TRC20', 'BEP20', 'ERC20', 'POLYGON']).optional(),
  lemontag: z.string().optional(),
  transactionHash: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = requestSchema.parse(body);

    // TODO: Verificar Firebase Auth token
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Buscar el inversor
    const investor = await prisma.investor.findUnique({
      where: { email: data.email },
      include: { portfolio: true },
    });

    if (!investor) {
      return NextResponse.json(
        { error: 'Investor not found' },
        { status: 404 }
      );
    }

    if (investor.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Investor is not active' },
        { status: 403 }
      );
    }

    // Validar retiros
    if (data.type === 'WITHDRAWAL') {
      if (!investor.portfolio) {
        return NextResponse.json(
          { error: 'No portfolio found' },
          { status: 400 }
        );
      }

      if (investor.portfolio.currentBalance < data.amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }
    }

    // Crear la solicitud
    const newRequest = await prisma.request.create({
      data: {
        investorId: investor.id,
        type: data.type,
        amount: data.amount,
        method: data.method,
        network: data.network,
        lemontag: data.lemontag,
        transactionHash: data.transactionHash,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ data: newRequest }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

