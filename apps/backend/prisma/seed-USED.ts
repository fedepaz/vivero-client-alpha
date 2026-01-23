// prisma/seed.ts

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL not found in .env file');
}

const adapter = new PrismaMariaDb(databaseUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  const tenant = await prisma.tenant.findFirst({
    where: { name: 'Default Organization' },
  });
  if (!tenant) throw new Error('Default tenant not found');

  for (let i = 1; i <= 10; i++) {
    const suffix = i.toString().padStart(2, '0'); // e.g., '01', '02'
    const passwordHash = await bcrypt.hash(`123${suffix}`, 12);
    const user = await prisma.user.create({
      data: {
        username: `usuario${suffix}`,
        email: `usuario${suffix}@viveroalpha.dev`,
        passwordHash,
        firstName: 'Usuario',
        lastName: `Apellido${suffix}`,
        tenantId: tenant.id,
      },
    });
    console.log(`✅ Created user usuario${suffix}`);
    console.info(`Información de usuario usuario${suffix}:`, user);
  }
}

main()
  .catch((e) => {
    console.error(`Error: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
