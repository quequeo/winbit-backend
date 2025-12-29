/**
 * Script para agregar solicitudes de ejemplo
 * Ejecutar con: npx tsx scripts/seed-requests.ts
 */

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });
dotenv.config();

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: [],
  });
}

const prisma = createPrismaClient();

async function main() {
  // Obtener inversores activos
  const investors = await prisma.investor.findMany({
    where: { status: 'ACTIVE' },
    take: 10,
  });

  if (investors.length === 0) {
    console.error('No hay inversores activos. Ejecutá primero: npm run seed:investors');
    process.exit(1);
  }

  const sampleRequests = [
    {
      investorEmail: investors[0]?.email || '',
      type: 'DEPOSIT' as const,
      amount: 5000,
      method: 'USDT' as const,
      network: 'TRC20' as const,
      transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
    },
    {
      investorEmail: investors[1]?.email || '',
      type: 'WITHDRAWAL' as const,
      amount: 2000,
      method: 'USDT' as const,
      network: 'TRC20' as const,
    },
    {
      investorEmail: investors[2]?.email || '',
      type: 'DEPOSIT' as const,
      amount: 10000,
      method: 'USDC' as const,
      network: 'ERC20' as const,
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    },
    {
      investorEmail: investors[3]?.email || '',
      type: 'WITHDRAWAL' as const,
      amount: 5000,
      method: 'LEMON_CASH' as const,
      lemontag: '@juanperez',
    },
    {
      investorEmail: investors[4]?.email || '',
      type: 'DEPOSIT' as const,
      amount: 7500,
      method: 'USDT' as const,
      network: 'BEP20' as const,
      transactionHash: '0x9876543210fedcba9876543210fedcba98765432',
    },
    {
      investorEmail: investors[0]?.email || '',
      type: 'WITHDRAWAL' as const,
      amount: 3000,
      method: 'CASH' as const,
    },
    {
      investorEmail: investors[1]?.email || '',
      type: 'DEPOSIT' as const,
      amount: 15000,
      method: 'USDC' as const,
      network: 'POLYGON' as const,
      transactionHash: '0xfedcba0987654321fedcba0987654321fedcba09',
    },
    {
      investorEmail: investors[2]?.email || '',
      type: 'WITHDRAWAL' as const,
      amount: 4000,
      method: 'SWIFT' as const,
    },
    {
      investorEmail: investors[3]?.email || '',
      type: 'DEPOSIT' as const,
      amount: 8000,
      method: 'USDT' as const,
      network: 'TRC20' as const,
      transactionHash: '0x1111222233334444555566667777888899990000',
    },
    {
      investorEmail: investors[4]?.email || '',
      type: 'WITHDRAWAL' as const,
      amount: 2500,
      method: 'LEMON_CASH' as const,
      lemontag: '@lauragarcia',
    },
  ];

  console.log('Agregando solicitudes de ejemplo...\n');

  for (const requestData of sampleRequests) {
    const investor = investors.find((inv) => inv.email === requestData.investorEmail);
    
    if (!investor) {
      console.log(`⚠️  Inversor ${requestData.investorEmail} no encontrado, saltando...`);
      continue;
    }

    // Verificar que no exista una solicitud similar reciente
    const existing = await prisma.request.findFirst({
      where: {
        investorId: investor.id,
        type: requestData.type,
        amount: requestData.amount,
        status: 'PENDING',
        requestedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
        },
      },
    });

    if (existing) {
      console.log(`Solicitud similar ya existe para ${investor.name}, saltando...`);
      continue;
    }

    console.log(
      `Creando ${requestData.type === 'DEPOSIT' ? 'Depósito' : 'Retiro'} de $${requestData.amount} para ${investor.name}...`
    );

    await prisma.request.create({
      data: {
        investorId: investor.id,
        type: requestData.type,
        amount: requestData.amount,
        method: requestData.method,
        network: requestData.network || null,
        transactionHash: requestData.transactionHash || null,
        lemontag: requestData.lemontag || null,
        status: 'PENDING',
      },
    });
  }

  console.log('\n✅ Solicitudes agregadas correctamente');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

