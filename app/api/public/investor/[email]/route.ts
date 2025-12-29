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
      include: {
        portfolio: true,
      },
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

    // Formatear la respuesta para el PWA
    const response = {
      investor: {
        email: investor.email,
        name: investor.name,
        code: investor.code,
      },
      portfolio: investor.portfolio
        ? {
            currentBalance: investor.portfolio.currentBalance,
            totalInvested: investor.portfolio.totalInvested,
            accumulatedReturnUSD: investor.portfolio.accumulatedReturnUSD,
            accumulatedReturnPercent: investor.portfolio.accumulatedReturnPercent,
            annualReturnUSD: investor.portfolio.annualReturnUSD,
            annualReturnPercent: investor.portfolio.annualReturnPercent,
            updatedAt: investor.portfolio.updatedAt,
          }
        : null,
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('Error fetching investor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

