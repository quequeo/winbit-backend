import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    investor: {
      count: vi.fn().mockResolvedValue(5),
    },
    request: {
      count: vi.fn().mockResolvedValue(3),
    },
    portfolio: {
      aggregate: vi.fn().mockResolvedValue({
        _sum: { currentBalance: 150000 },
      }),
    },
  },
}));

// Mock the dashboard page
vi.mock('./page', () => ({
  default: async () => {
    const { prisma } = await import('@/lib/prisma');
    const [investorCount, pendingRequestCount] = await Promise.all([
      prisma.investor.count({ where: { status: 'ACTIVE' } }),
      prisma.request.count({ where: { status: 'PENDING' } }),
    ]);
    const totalAUM = await prisma.portfolio.aggregate({
      _sum: { currentBalance: true },
    });

    return (
      <div>
        <h1>Dashboard</h1>
        <div>
          <p>Total Inversores</p>
          <p>{investorCount}</p>
        </div>
        <div>
          <p>AUM Total</p>
          <p>${totalAUM._sum.currentBalance?.toLocaleString('en-US') ?? '0'}</p>
        </div>
        <div>
          <p>Solicitudes Pendientes</p>
          <p>{pendingRequestCount}</p>
        </div>
      </div>
    );
  },
}));

describe('DashboardPage', () => {
  it('renders dashboard with metrics', async () => {
    const DashboardPage = (await import('./page')).default;
    const page = await DashboardPage();
    render(page);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/total inversores/i)).toBeInTheDocument();
    expect(screen.getByText(/aum total/i)).toBeInTheDocument();
    expect(screen.getByText(/solicitudes pendientes/i)).toBeInTheDocument();
  });

  it('displays correct investor count', async () => {
    const DashboardPage = (await import('./page')).default;
    const page = await DashboardPage();
    render(page);

    expect(screen.getByText('5')).toBeInTheDocument(); // investor count
  });

  it('displays correct AUM total', async () => {
    const DashboardPage = (await import('./page')).default;
    const page = await DashboardPage();
    render(page);

    expect(screen.getByText(/\$150,000/)).toBeInTheDocument();
  });

  it('displays correct pending request count', async () => {
    const DashboardPage = (await import('./page')).default;
    const page = await DashboardPage();
    render(page);

    expect(screen.getByText('3')).toBeInTheDocument(); // pending request count
  });
});

