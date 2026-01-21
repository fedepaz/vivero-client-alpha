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
  console.log('Sedding with root user');

  // Create default tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Default Organization',
    },
  });
  console.log('✅ Default tenant created');
  console.log(`Tenant Information: ${JSON.stringify(tenant)}`);

  // Create admin and user roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
    },
  });
  const userRole = await prisma.role.create({
    data: {
      name: 'user',
    },
  });
  console.log('✅ Admin and user roles created');
  console.log(`Role Information: ${JSON.stringify(adminRole)}`);
  console.log(`Role Information: ${JSON.stringify(userRole)}`);

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 12);

  const rootUser = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      firstName: 'Root',
      lastName: 'Admin',
      passwordHash,
      tenantId: tenant.id,
      roleId: adminRole.id,
    },
  });
  console.log('✅ Root user created');
  console.log(`User Information: ${JSON.stringify(rootUser)}`);
}

main()
  .catch((e) => {
    console.error(`Error: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
