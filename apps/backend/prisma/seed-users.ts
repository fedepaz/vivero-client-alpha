// prisma/seed-users.ts

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PermissionScope, PrismaClient } from '../src/generated/prisma/client';
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

    const user = await prisma.user.upsert({
      where: { username: `usuario${suffix}` },
      create: {
        username: `usuario${suffix}`,
        email: `usuario${suffix}@viveroalpha.dev`,
        passwordHash,
        firstName: 'Usuario',
        lastName: `Apellido${suffix}`,
        tenantId: tenant.id,
        isActive: true,
      },
      update: {},
    });

    const user01permissions = [
      // Can see all user but not update or delete
      {
        table: 'users',
        crud: { create: true, read: true, update: false, delete: false },
        scope: PermissionScope.ALL,
      },
      // Can see and update plants but not delete
      {
        table: 'plants',
        crud: { create: true, read: true, update: true, delete: false },
        scope: PermissionScope.ALL,
      },
      // Can see, update and delete clients
      {
        table: 'clients',
        crud: { create: true, read: true, update: true, delete: true },
        scope: PermissionScope.ALL,
      },
    ];
    if (i !== 1) {
      await prisma.userPermission.upsert({
        where: { userId_tableName: { userId: user.id, tableName: 'users' } },
        create: {
          userId: user.id,
          tableName: 'users',
          canRead: true,
          scope: 'OWN',
        },
        update: { canRead: true, scope: 'OWN' },
      });
    } else {
      for (const perm of user01permissions) {
        await prisma.userPermission.upsert({
          where: {
            userId_tableName: {
              userId: user.id,
              tableName: perm.table,
            },
          },
          create: {
            userId: user.id,
            tableName: perm.table,
            canCreate: perm.crud.create,
            canRead: perm.crud.read,
            canUpdate: perm.crud.update,
            canDelete: perm.crud.delete,
            scope: perm.scope,
          },
          update: {
            canCreate: perm.crud.create,
            canRead: perm.crud.read,
            canUpdate: perm.crud.update,
            canDelete: perm.crud.delete,
            scope: perm.scope,
          },
        });
      }
    }

    console.log(`✅ Created user:`, user);
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
