import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email: rawEmail } = await params;
    const email = decodeURIComponent(rawEmail);

    // TODO: Verificar Firebase Auth token
    // const token = request.headers.get('authorization')?.replace('Bearer ', '');
    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Buscar el inversor
    const investor = await prisma.investor.findUnique({
      where: { email },
      select: { id: true, status: true },
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

    // Obtener el historial
    const history = await prisma.portfolioHistory.findMany({
      where: { investorId: investor.id },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ data: history });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

