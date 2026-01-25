// prisma/seed-admin.ts

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
  // Create or update the tenant - 'Default Organization'
  let tenantId: string;

  const existingTenant = await prisma.tenant.findFirst({
    where: { name: 'Default Organization' },
  });

  if (existingTenant) {
    tenantId = existingTenant.id;
    console.log('✅ Default tenant found');
  } else {
    const newTenant = await prisma.tenant.create({
      data: {
        name: 'Default Organization',
      },
    });
    tenantId = newTenant.id;
    console.log('✅ Default tenant created');
  }

  // Create admin user + full permissions
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    create: {
      username: 'admin',
      email: 'admin@viveroalpha.dev',
      passwordHash: await bcrypt.hash('admin123', 12),
      firstName: 'Admin',
      lastName: 'User',
      tenantId,
      isActive: true,
    },
    update: {},
  });

  // Define permissions for the admin user
  const adminPermissions = [
    // Core admin tables - full access
    {
      table: 'tenants',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
    {
      table: 'users',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
    {
      table: 'audit_logs',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
    {
      table: 'messages',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
    {
      table: 'enums',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
    {
      table: 'clients',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
    {
      table: 'invoices',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
    {
      table: 'plants',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
    {
      table: 'purchase_orders',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
    {
      table: 'user_permissions',
      crud: { create: true, read: true, update: true, delete: true },
      scope: PermissionScope.ALL,
    },
  ];

  // Upsert permissions for the admin user
  for (const perm of adminPermissions) {
    await prisma.userPermission.upsert({
      where: {
        userId_tableName: {
          userId: admin.id,
          tableName: perm.table,
        },
      },
      create: {
        userId: admin.id,
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
    console.log(`Granted permissions for ${perm.table} (${perm.scope})`);
  }

  console.log('✅ Admin permissions granted');
}

main()
  .catch((e) => {
    console.error(`Error: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
