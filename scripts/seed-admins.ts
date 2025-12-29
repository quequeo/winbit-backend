/**
 * Script para agregar los admins iniciales
 * Ejecutar con: npx tsx scripts/seed-admins.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const initialAdmins = [
    {
      email: 'winbit.cfds@gmail.com',
      name: 'Winbit Admin',
      role: 'SUPERADMIN' as const,
    },
    {
      email: 'jaimegarciamendez@gmail.com',
      name: 'Jaime García',
      role: 'SUPERADMIN' as const,
    },
  ];

  console.log('Agregando admins iniciales...');

  for (const admin of initialAdmins) {
    const existing = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (existing) {
      console.log(`Admin ${admin.email} ya existe, actualizando...`);
      await prisma.user.update({
        where: { email: admin.email },
        data: admin,
      });
    } else {
      console.log(`Creando admin ${admin.email}...`);
      await prisma.user.create({
        data: admin,
      });
    }
  }

  console.log('✅ Admins iniciales agregados correctamente');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

