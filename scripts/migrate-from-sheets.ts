/**
 * Script de migración desde Google Sheets
 * Importa inversores y sus portfolios desde la planilla de Google Sheets
 *
 * Uso:
 *   npx tsx scripts/migrate-from-sheets.ts              # Migrar datos
 *   npx tsx scripts/migrate-from-sheets.ts --dry-run    # Solo previsualizar
 *   npx tsx scripts/migrate-from-sheets.ts --sheet=INVESTORS  # Especificar hoja
 *
 * Configuración requerida en .env:
 *   - DATABASE_URL
 *   - GOOGLE_SHEETS_ID
 *   - GOOGLE_SHEETS_API_KEY
 */

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });
dotenv.config();

// Configuración de mapeo de columnas (ajustar según tu planilla)
const COLUMN_MAPPING = {
  email: ['email', 'correo', 'mail', 'e-mail'],
  name: ['nombre', 'name', 'inversor', 'investor'],
  code: ['código', 'codigo', 'code', 'id'],
  currentBalance: ['saldo actual', 'saldo', 'balance', 'current balance'],
  totalInvested: ['total invertido', 'invertido', 'invested', 'total invested'],
  accumulatedReturnUSD: ['rendimiento acumulado usd', 'rendimiento usd', 'return usd', 'accumulated return'],
  accumulatedReturnPercent: ['rendimiento acumulado %', 'rendimiento %', 'return %', 'accumulated return %'],
  annualReturnUSD: ['rendimiento anual usd', 'anual usd', 'annual return usd'],
  annualReturnPercent: ['rendimiento anual %', 'anual %', 'annual return %'],
  status: ['estado', 'status', 'activo'],
};

interface SheetRow {
  email: string;
  name: string;
  code: string;
  currentBalance: number;
  totalInvested: number;
  accumulatedReturnUSD: number;
  accumulatedReturnPercent: number;
  annualReturnUSD: number;
  annualReturnPercent: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface MigrationStats {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

function createPrismaClient(): PrismaClient {
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

async function fetchSheetData(sheetName: string): Promise<{
  headers: string[];
  rows: string[][];
  error: string | null;
}> {
  const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
  const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    return {
      headers: [],
      rows: [],
      error: 'GOOGLE_SHEETS_ID o GOOGLE_SHEETS_API_KEY no configurados en .env',
    };
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}!A:Z?key=${API_KEY}`;

  console.log(`📊 Obteniendo datos de hoja "${sheetName}"...`);

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      return {
        headers: [],
        rows: [],
        error: `Hoja "${sheetName}" no encontrada`,
      };
    }
    const errorText = await response.text();
    return {
      headers: [],
      rows: [],
      error: `Error de Google Sheets API: ${response.status} - ${errorText}`,
    };
  }

  const data = await response.json();
  const values = data.values || [];

  if (values.length === 0) {
    return {
      headers: [],
      rows: [],
      error: 'No se encontraron datos en la hoja',
    };
  }

  return {
    headers: values[0] || [],
    rows: values.slice(1),
    error: null,
  };
}

function findColumnIndex(headers: string[], fieldName: keyof typeof COLUMN_MAPPING): number {
  const possibleNames = COLUMN_MAPPING[fieldName];
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

  for (const name of possibleNames) {
    const index = normalizedHeaders.indexOf(name.toLowerCase());
    if (index !== -1) return index;
  }

  return -1;
}

function parseNumber(value: string | undefined): number {
  if (!value) return 0;
  // Limpiar el valor: quitar $, %, espacios, y convertir comas a puntos
  const cleaned = value
    .replace(/[$%\s]/g, '')
    .replace(/,/g, '.')
    .trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseStatus(value: string | undefined): 'ACTIVE' | 'INACTIVE' {
  if (!value) return 'ACTIVE';
  const lower = value.toLowerCase().trim();
  if (['inactivo', 'inactive', 'no', 'false', '0'].includes(lower)) {
    return 'INACTIVE';
  }
  return 'ACTIVE';
}

function parseRows(headers: string[], rows: string[][]): { data: SheetRow[]; warnings: string[] } {
  const warnings: string[] = [];

  // Encontrar índices de columnas
  const indices = {
    email: findColumnIndex(headers, 'email'),
    name: findColumnIndex(headers, 'name'),
    code: findColumnIndex(headers, 'code'),
    currentBalance: findColumnIndex(headers, 'currentBalance'),
    totalInvested: findColumnIndex(headers, 'totalInvested'),
    accumulatedReturnUSD: findColumnIndex(headers, 'accumulatedReturnUSD'),
    accumulatedReturnPercent: findColumnIndex(headers, 'accumulatedReturnPercent'),
    annualReturnUSD: findColumnIndex(headers, 'annualReturnUSD'),
    annualReturnPercent: findColumnIndex(headers, 'annualReturnPercent'),
    status: findColumnIndex(headers, 'status'),
  };

  // Validar columnas requeridas
  if (indices.email === -1) {
    throw new Error('Columna de email no encontrada. Columnas disponibles: ' + headers.join(', '));
  }
  if (indices.name === -1) {
    warnings.push('⚠️  Columna de nombre no encontrada, se usará el email como nombre');
  }
  if (indices.code === -1) {
    warnings.push('⚠️  Columna de código no encontrada, se generará automáticamente');
  }

  console.log('\n📋 Mapeo de columnas detectado:');
  Object.entries(indices).forEach(([field, index]) => {
    if (index !== -1) {
      console.log(`   ${field}: columna "${headers[index]}" (índice ${index})`);
    }
  });

  const data: SheetRow[] = [];

  rows.forEach((row, rowIndex) => {
    const email = row[indices.email]?.trim();

    // Saltar filas sin email
    if (!email || !email.includes('@')) {
      if (email) {
        warnings.push(`⚠️  Fila ${rowIndex + 2}: email inválido "${email}", saltando`);
      }
      return;
    }

    const name = indices.name !== -1 ? row[indices.name]?.trim() : email.split('@')[0];
    const code = indices.code !== -1 ? row[indices.code]?.trim() : generateCode(name || email);

    data.push({
      email,
      name: name || email.split('@')[0],
      code: code || generateCode(name || email),
      currentBalance: parseNumber(row[indices.currentBalance]),
      totalInvested: parseNumber(row[indices.totalInvested]),
      accumulatedReturnUSD: parseNumber(row[indices.accumulatedReturnUSD]),
      accumulatedReturnPercent: parseNumber(row[indices.accumulatedReturnPercent]),
      annualReturnUSD: parseNumber(row[indices.annualReturnUSD]),
      annualReturnPercent: parseNumber(row[indices.annualReturnPercent]),
      status: parseStatus(row[indices.status]),
    });
  });

  return { data, warnings };
}

function generateCode(name: string): string {
  const initials = name
    .split(/\s+/)
    .map(word => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${initials || 'XX'}-${year}-${random}`;
}

async function migrateData(
  prisma: PrismaClient,
  data: SheetRow[],
  dryRun: boolean
): Promise<MigrationStats> {
  const stats: MigrationStats = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  for (const row of data) {
    try {
      const existing = await prisma.investor.findUnique({
        where: { email: row.email },
        include: { portfolio: true },
      });

      if (dryRun) {
        if (existing) {
          console.log(`   🔄 Actualizar: ${row.name} (${row.email})`);
          stats.updated++;
        } else {
          console.log(`   ➕ Crear: ${row.name} (${row.email})`);
          stats.created++;
        }
        continue;
      }

      if (existing) {
        // Actualizar inversor existente
        await prisma.investor.update({
          where: { email: row.email },
          data: {
            name: row.name,
            status: row.status,
          },
        });

        // Actualizar o crear portfolio
        await prisma.portfolio.upsert({
          where: { investorId: existing.id },
          create: {
            investorId: existing.id,
            currentBalance: row.currentBalance,
            totalInvested: row.totalInvested,
            accumulatedReturnUSD: row.accumulatedReturnUSD,
            accumulatedReturnPercent: row.accumulatedReturnPercent,
            annualReturnUSD: row.annualReturnUSD,
            annualReturnPercent: row.annualReturnPercent,
          },
          update: {
            currentBalance: row.currentBalance,
            totalInvested: row.totalInvested,
            accumulatedReturnUSD: row.accumulatedReturnUSD,
            accumulatedReturnPercent: row.accumulatedReturnPercent,
            annualReturnUSD: row.annualReturnUSD,
            annualReturnPercent: row.annualReturnPercent,
          },
        });

        console.log(`   🔄 Actualizado: ${row.name} (${row.email})`);
        stats.updated++;
      } else {
        // Verificar si el código ya existe
        let code = row.code;
        const existingCode = await prisma.investor.findUnique({
          where: { code },
        });
        if (existingCode) {
          code = generateCode(row.name);
        }

        // Crear nuevo inversor
        const investor = await prisma.investor.create({
          data: {
            email: row.email,
            name: row.name,
            code,
            status: row.status,
          },
        });

        // Crear portfolio
        await prisma.portfolio.create({
          data: {
            investorId: investor.id,
            currentBalance: row.currentBalance,
            totalInvested: row.totalInvested,
            accumulatedReturnUSD: row.accumulatedReturnUSD,
            accumulatedReturnPercent: row.accumulatedReturnPercent,
            annualReturnUSD: row.annualReturnUSD,
            annualReturnPercent: row.annualReturnPercent,
          },
        });

        console.log(`   ➕ Creado: ${row.name} (${row.email}) - Código: ${code}`);
        stats.created++;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      stats.errors.push(`${row.email}: ${errorMsg}`);
      console.log(`   ❌ Error con ${row.email}: ${errorMsg}`);
    }
  }

  return stats;
}

async function main() {
  // Parsear argumentos
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const sheetArg = args.find(arg => arg.startsWith('--sheet='));
  const sheetName = sheetArg ? sheetArg.split('=')[1] : 'DASHBOARD';

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       MIGRACIÓN DESDE GOOGLE SHEETS - WINBIT BACKEND       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (dryRun) {
    console.log('🔍 MODO DRY-RUN: Solo se previsualizarán los cambios\n');
  }

  // Obtener datos de Google Sheets
  const { headers, rows, error } = await fetchSheetData(sheetName);

  if (error) {
    console.error(`\n❌ Error: ${error}`);
    process.exit(1);
  }

  console.log(`✅ Datos obtenidos: ${rows.length} filas\n`);

  // Parsear filas
  const { data, warnings } = parseRows(headers, rows);

  if (warnings.length > 0) {
    console.log('\n⚠️  Advertencias:');
    warnings.forEach(w => console.log(`   ${w}`));
  }

  if (data.length === 0) {
    console.log('\n❌ No se encontraron datos válidos para migrar');
    process.exit(1);
  }

  console.log(`\n📊 Inversores a procesar: ${data.length}`);

  // Preview de datos
  console.log('\n┌──────────────────────────────────────────────────────────────┐');
  console.log('│ Vista previa de datos                                        │');
  console.log('├──────────────────────────────────────────────────────────────┤');
  data.slice(0, 5).forEach(row => {
    console.log(`│ ${row.name.padEnd(25)} │ $${row.currentBalance.toLocaleString().padStart(12)} │`);
  });
  if (data.length > 5) {
    console.log(`│ ... y ${data.length - 5} más                                              │`);
  }
  console.log('└──────────────────────────────────────────────────────────────┘');

  // Conectar a la base de datos
  const prisma = createPrismaClient();

  try {
    console.log('\n🔄 Procesando migración...\n');

    const stats = await migrateData(prisma, data, dryRun);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                      RESUMEN                               ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  ➕ Creados:     ${stats.created.toString().padStart(4)}                                     ║`);
    console.log(`║  🔄 Actualizados: ${stats.updated.toString().padStart(4)}                                     ║`);
    console.log(`║  ⏭️  Saltados:    ${stats.skipped.toString().padStart(4)}                                     ║`);
    console.log(`║  ❌ Errores:     ${stats.errors.length.toString().padStart(4)}                                     ║`);
    console.log('╚════════════════════════════════════════════════════════════╝');

    if (stats.errors.length > 0) {
      console.log('\n❌ Errores encontrados:');
      stats.errors.forEach(e => console.log(`   - ${e}`));
    }

    if (dryRun) {
      console.log('\n💡 Para ejecutar la migración real, quita el flag --dry-run');
    } else {
      console.log('\n✅ Migración completada exitosamente');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('\n❌ Error fatal:', e);
    process.exit(1);
  });
