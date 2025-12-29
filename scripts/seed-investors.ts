/**
 * Script para agregar inversores de ejemplo
 * Ejecutar con: npx tsx scripts/seed-investors.ts
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
  const sampleInvestors = [
    {
      email: 'maria.rodriguez@example.com',
      name: 'María Rodríguez',
      code: 'MR-2024',
      portfolio: {
        currentBalance: 25000,
        totalInvested: 20000,
        accumulatedReturnUSD: 5000,
        accumulatedReturnPercent: 25.0,
        annualReturnUSD: 3000,
        annualReturnPercent: 15.0,
      },
    },
    {
      email: 'carlos.martinez@example.com',
      name: 'Carlos Martínez',
      code: 'CM-2024',
      portfolio: {
        currentBalance: 45000,
        totalInvested: 40000,
        accumulatedReturnUSD: 5000,
        accumulatedReturnPercent: 12.5,
        annualReturnUSD: 4000,
        annualReturnPercent: 10.0,
      },
    },
    {
      email: 'ana.lopez@example.com',
      name: 'Ana López',
      code: 'AL-2024',
      portfolio: {
        currentBalance: 15000,
        totalInvested: 12000,
        accumulatedReturnUSD: 3000,
        accumulatedReturnPercent: 25.0,
        annualReturnUSD: 1800,
        annualReturnPercent: 15.0,
      },
    },
    {
      email: 'juan.perez@example.com',
      name: 'Juan Pérez',
      code: 'JP-2024',
      portfolio: {
        currentBalance: 80000,
        totalInvested: 70000,
        accumulatedReturnUSD: 10000,
        accumulatedReturnPercent: 14.29,
        annualReturnUSD: 8000,
        annualReturnPercent: 11.43,
      },
    },
    {
      email: 'laura.garcia@example.com',
      name: 'Laura García',
      code: 'LG-2024',
      portfolio: {
        currentBalance: 35000,
        totalInvested: 30000,
        accumulatedReturnUSD: 5000,
        accumulatedReturnPercent: 16.67,
        annualReturnUSD: 3500,
        annualReturnPercent: 11.67,
      },
    },
  ];

  console.log('Agregando inversores de ejemplo...\n');

  for (const investorData of sampleInvestors) {
    const { portfolio, ...investorInfo } = investorData;
    
    // Verificar si ya existe
    const existing = await prisma.investor.findUnique({
      where: { email: investorInfo.email },
    });

    if (existing) {
      console.log(`Inversor ${investorInfo.email} ya existe, actualizando...`);
      
      // Actualizar inversor
      await prisma.investor.update({
        where: { email: investorInfo.email },
        data: {
          name: investorInfo.name,
          code: investorInfo.code,
        },
      });

      // Actualizar portfolio
      await prisma.portfolio.upsert({
        where: { investorId: existing.id },
        create: {
          investorId: existing.id,
          ...portfolio,
        },
        update: portfolio,
      });
    } else {
      console.log(`Creando inversor ${investorInfo.name} (${investorInfo.email})...`);
      
      // Crear inversor
      const investor = await prisma.investor.create({
        data: {
          email: investorInfo.email,
          name: investorInfo.name,
          code: investorInfo.code,
          status: 'ACTIVE',
        },
      });

      // Crear portfolio
      await prisma.portfolio.create({
        data: {
          investorId: investor.id,
          ...portfolio,
        },
      });
    }
  }

  console.log('\n✅ Inversores agregados correctamente');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

