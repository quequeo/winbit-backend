import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { enabled: true },
      orderBy: [{ asset: 'asc' }, { network: 'asc' }],
    });

    return NextResponse.json({ data: wallets });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

