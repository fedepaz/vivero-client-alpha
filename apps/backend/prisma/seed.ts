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

async function seeder(randomLastName: string) {
  console.log('Sedding with users');

  // Find default tenant
  const tenant = await prisma.tenant.findFirst({
    where: {
      name: 'Default Organization',
    },
  });

  if (!tenant) {
    throw new Error('Default tenant not found');
  }
  console.log('✅ Default tenant');
  console.log(`Tenant Information: ${JSON.stringify(tenant)}`);

  // Create admin user
  const passwordHash = await bcrypt.hash(`123${randomLastName}`, 12);

  const randomUser = await prisma.user.create({
    data: {
      username: `usuario${randomLastName}`,
      email: `usuario${randomLastName}@viveroalpha.dev`,
      passwordHash,
      firstName: 'Usuario',
      lastName: randomLastName,
      tenantId: tenant.id,
    },
  });
  console.log('✅ Root user created');
  console.log(`User Information: ${JSON.stringify(randomUser)}`);
}

async function main() {
  let lastName = 'aplha';
  for (let i = 0; i < 10; i++) {
    lastName = lastName + i;
    await seeder(lastName);
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
