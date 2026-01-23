# Permission System Technical Design Document

## 1. Overview

**Simple, flat permission model:**
- Per-user, per-table CRUD permissions
- No roles, no inheritance, no groups
- Optional row-level filtering (ALL vs OWN)
- Cache-first architecture for performance
- Explicit permission grants only

**Note on "Roles" in other documentation:**
While other project documentation (e.g., Tech Stack Guide, Product Manager Agent, etc.) may refer to "Role-Based Access Control (RBAC)" or "roles", for this project's implementation, the permission system is based on this "simple, flat permission model". Any mention of "roles" should be interpreted as predefined collections or templates of these granular, per-user, per-table CRUD permissions, rather than a distinct, hierarchical RBAC layer. This design prioritizes explicit, auditable permissions over abstract role assignments.

---

## 2. Database Schema

### 2.1 Prisma Models

```prisma
// schema.prisma

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String   // bcrypt hashed
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([username])
  @@map("users")
}

model UserPermission {
  id        String   @id @default(cuid())
  userId    String
  tableName String   // e.g., "plants", "greenhouses", "reports"
  
  // CRUD flags
  canCreate Boolean  @default(false)
  canRead   Boolean  @default(false)
  canUpdate Boolean  @default(false)
  canDelete Boolean  @default(false)
  
  // Row-level scope
  scope     PermissionScope @default(NONE)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, tableName])
  @@index([userId])
  @@index([tableName])
  @@map("user_permissions")
}

enum PermissionScope {
  NONE // No access
  OWN  // Only records created by this user
  ALL  // All records in the table
}

// Example entity: Plant
model Plant {
  id          String   @id @default(cuid())
  name        String
  species     String
  location    String?
  createdById String   // Foreign key to User
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  createdBy User @relation(fields: [createdById], references: [id])

  @@index([createdById])
  @@map("plants")
}
```

### 2.2 Migration Example

```sql
-- Migration: 001_create_permissions.sql

CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `username` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_username_key`(`username`),
  UNIQUE INDEX `users_email_key`(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_permissions` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `table_name` VARCHAR(191) NOT NULL,
  `can_create` BOOLEAN NOT NULL DEFAULT false,
  `can_read` BOOLEAN NOT NULL DEFAULT false,
  `can_update` BOOLEAN NOT NULL DEFAULT false,
  `can_delete` BOOLEAN NOT NULL DEFAULT false,
  `scope` ENUM('NONE', 'OWN', 'ALL') NOT NULL DEFAULT 'NONE',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_permissions_user_id_table_name_key`(`user_id`, `table_name`),
  INDEX `user_permissions_user_id_idx`(`user_id`),
  INDEX `user_permissions_table_name_idx`(`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `plants` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `species` VARCHAR(191) NOT NULL,
  `location` VARCHAR(191),
  `created_by_id` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `plants_created_by_id_idx`(`created_by_id`),
  CONSTRAINT `plants_created_by_id_fkey` 
    FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. Backend Implementation (NestJS)

### 3.1 Permission Service

```typescript
// src/permissions/permissions.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

export interface PermissionCheck {
  tableName: string;
  action: 'create' | 'read' | 'update' | 'delete';
  scope?: 'OWN' | 'ALL';
}

export interface UserPermissions {
  [tableName: string]: {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    scope: 'NONE' | 'OWN' | 'ALL';
  };
}

@Injectable()
export class PermissionsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /**
   * Get all permissions for a user (with caching)
   */
  async getUserPermissions(userId: string): Promise<UserPermissions> {
    const cacheKey = `permissions:${userId}`;
    
    // L2 Cache: Check Valkey
    const cached = await this.cache.get<UserPermissions>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const permissions = await this.prisma.userPermission.findMany({
      where: { userId },
    });

    // Transform to map
    const permissionMap: UserPermissions = {};
    permissions.forEach((perm) => {
      permissionMap[perm.tableName] = {
        canCreate: perm.canCreate,
        canRead: perm.canRead,
        canUpdate: perm.canUpdate,
        canDelete: perm.canDelete,
        scope: perm.scope,
      };
    });

    // Cache for 1 hour
    await this.cache.set(cacheKey, permissionMap, 3600);

    return permissionMap;
  }

  /**
   * Check if user can perform action on table
   */
  async canPerform(
    userId: string,
    check: PermissionCheck,
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    const tablePerm = permissions[check.tableName];

    if (!tablePerm) {
      return false; // No permissions for this table
    }

    // Check CRUD permission
    const hasActionPermission = tablePerm[`can${this.capitalize(check.action)}`];
    if (!hasActionPermission) {
      return false;
    }

    // Check scope if specified
    if (check.scope) {
      if (check.scope === 'ALL' && tablePerm.scope !== 'ALL') {
        return false;
      }
      if (check.scope === 'OWN' && tablePerm.scope === 'NONE') {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if user can access specific record (row-level check)
   */
  async canAccessRecord(
    userId: string,
    tableName: string,
    action: 'read' | 'update' | 'delete',
    recordOwnerId: string,
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    const tablePerm = permissions[tableName];

    if (!tablePerm) {
      return false;
    }

    const hasActionPermission = tablePerm[`can${this.capitalize(action)}`];
    if (!hasActionPermission) {
      return false;
    }

    // Check scope
    if (tablePerm.scope === 'ALL') {
      return true; // Can access all records
    }

    if (tablePerm.scope === 'OWN') {
      return recordOwnerId === userId; // Can only access own records
    }

    return false; // NONE scope
  }

  /**
   * Invalidate user permissions cache
   */
  async invalidateCache(userId: string): Promise<void> {
    const cacheKey = `permissions:${userId}`;
    await this.cache.delete(cacheKey);
  }

  /**
   * Grant permission to user
   */
  async grantPermission(
    userId: string,
    tableName: string,
    permissions: {
      canCreate?: boolean;
      canRead?: boolean;
      canUpdate?: boolean;
      canDelete?: boolean;
      scope?: 'NONE' | 'OWN' | 'ALL';
    },
  ): Promise<void> {
    await this.prisma.userPermission.upsert({
      where: {
        userId_tableName: { userId, tableName },
      },
      create: {
        userId,
        tableName,
        ...permissions,
      },
      update: permissions,
    });

    await this.invalidateCache(userId);
  }

  /**
   * Revoke all permissions for a table
   */
  async revokeTablePermissions(
    userId: string,
    tableName: string,
  ): Promise<void> {
    await this.prisma.userPermission.delete({
      where: {
        userId_tableName: { userId, tableName },
      },
    });

    await this.invalidateCache(userId);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
```

### 3.2 Permission Guard

```typescript
// src/permissions/permissions.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from './permissions.service';

export const REQUIRE_PERMISSION = 'requirePermission';

export interface RequirePermissionMetadata {
  tableName: string;
  action: 'create' | 'read' | 'update' | 'delete';
  scope?: 'OWN' | 'ALL';
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<RequirePermissionMetadata>(
      REQUIRE_PERMISSION,
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true; // No permission required
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const canPerform = await this.permissionsService.canPerform(userId, {
      tableName: requiredPermission.tableName,
      action: requiredPermission.action,
      scope: requiredPermission.scope,
    });

    if (!canPerform) {
      throw new ForbiddenException(
        `You do not have permission to ${requiredPermission.action} on ${requiredPermission.tableName}`,
      );
    }

    return true;
  }
}
```

### 3.3 Permission Decorator

```typescript
// src/permissions/permissions.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { REQUIRE_PERMISSION, RequirePermissionMetadata } from './permissions.guard';

export const RequirePermission = (permission: RequirePermissionMetadata) =>
  SetMetadata(REQUIRE_PERMISSION, permission);
```

### 3.4 Example Controller

```typescript
// src/plants/plants.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermission } from '../permissions/permissions.decorator';
import { PlantsService } from './plants.service';
import { PermissionsService } from '../permissions/permissions.service';

@Controller('plants')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PlantsController {
  constructor(
    private plantsService: PlantsService,
    private permissionsService: PermissionsService,
  ) {}

  @Post()
  @RequirePermission({ tableName: 'plants', action: 'create' })
  async create(@Request() req, @Body() createDto: any) {
    return this.plantsService.create({
      ...createDto,
      createdById: req.user.id,
    });
  }

  @Get()
  @RequirePermission({ tableName: 'plants', action: 'read' })
  async findAll(@Request() req) {
    const permissions = await this.permissionsService.getUserPermissions(
      req.user.id,
    );
    const plantPerm = permissions['plants'];

    if (plantPerm?.scope === 'ALL') {
      return this.plantsService.findAll();
    } else if (plantPerm?.scope === 'OWN') {
      return this.plantsService.findByCreator(req.user.id);
    }

    return [];
  }

  @Get(':id')
  @RequirePermission({ tableName: 'plants', action: 'read' })
  async findOne(@Request() req, @Param('id') id: string) {
    const plant = await this.plantsService.findOne(id);

    const canAccess = await this.permissionsService.canAccessRecord(
      req.user.id,
      'plants',
      'read',
      plant.createdById,
    );

    if (!canAccess) {
      throw new ForbiddenException('You cannot access this plant');
    }

    return plant;
  }

  @Put(':id')
  @RequirePermission({ tableName: 'plants', action: 'update' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: any,
  ) {
    const plant = await this.plantsService.findOne(id);

    const canAccess = await this.permissionsService.canAccessRecord(
      req.user.id,
      'plants',
      'update',
      plant.createdById,
    );

    if (!canAccess) {
      throw new ForbiddenException('You cannot update this plant');
    }

    return this.plantsService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermission({ tableName: 'plants', action: 'delete' })
  async remove(@Request() req, @Param('id') id: string) {
    const plant = await this.plantsService.findOne(id);

    const canAccess = await this.permissionsService.canAccessRecord(
      req.user.id,
      'plants',
      'delete',
      plant.createdById,
    );

    if (!canAccess) {
      throw new ForbiddenException('You cannot delete this plant');
    }

    return this.plantsService.remove(id);
  }
}
```

---

## 4. Frontend Implementation (Next.js)

### 4.1 Permission Context

```typescript
// src/contexts/PermissionsContext.tsx

'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface UserPermissions {
  [tableName: string]: {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    scope: 'NONE' | 'OWN' | 'ALL';
  };
}

interface PermissionsContextType {
  permissions: UserPermissions | null;
  loading: boolean;
  canPerform: (tableName: string, action: 'create' | 'read' | 'update' | 'delete') => boolean;
  refetch: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType>({
  permissions: null,
  loading: true,
  canPerform: () => false,
  refetch: async () => {},
});

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/permissions/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPermissions(data.permissions);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const canPerform = (
    tableName: string,
    action: 'create' | 'read' | 'update' | 'delete',
  ): boolean => {
    if (!permissions) return false;

    const tablePerm = permissions[tableName];
    if (!tablePerm) return false;

    const actionKey = `can${action.charAt(0).toUpperCase() + action.slice(1)}` as keyof typeof tablePerm;
    return tablePerm[actionKey] === true;
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        loading,
        canPerform,
        refetch: fetchPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export const usePermissions = () => useContext(PermissionsContext);
```

### 4.2 Protected Component Example

```typescript
// src/components/PlantsList.tsx

'use client';

import { usePermissions } from '@/contexts/PermissionsContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PlantsList() {
  const { canPerform, permissions } = usePermissions();

  const canCreatePlant = canPerform('plants', 'create');
  const canReadPlant = canPerform('plants', 'read');
  const plantScope = permissions?.['plants']?.scope;

  if (!canReadPlant) {
    return <div>You do not have permission to view plants.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Plants {plantScope === 'OWN' && '(My Plants)'}</h1>
        {canCreatePlant && (
          <Button asChild>
            <Link href="/plants/new">Create Plant</Link>
          </Button>
        )}
      </div>
      {/* Plant list here */}
    </div>
  );
}
```

### 4.3 API Route to Fetch Permissions

```typescript
// src/app/api/permissions/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.sub;

    // Fetch from backend
    const res = await fetch(`${process.env.BACKEND_URL}/permissions/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const permissions = await res.json();

    return NextResponse.json({ permissions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}
```

---

## 5. Request Flow

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ 1. POST /api/plants
       │    Authorization: Bearer <JWT>
       ▼
┌─────────────────┐
│  JWT Auth Guard │ ← Validates token, extracts userId
└──────┬──────────┘
       │ 2. userId extracted
       ▼
┌──────────────────┐
│ Permissions Guard│
└──────┬───────────┘
       │ 3. Check @RequirePermission({ tableName: 'plants', action: 'create' })
       ▼
┌──────────────────────┐
│ PermissionsService   │
└──────┬───────────────┘
       │ 4. getUserPermissions(userId)
       ▼
┌──────────────────┐     Cache HIT?
│  Valkey Cache    │────────Yes────────┐
└──────┬───────────┘                   │
       │ No                             │
       │ 5. Query DB                    │
       ▼                                │
┌──────────────────┐                   │
│  MariaDB         │                   │
│  user_permissions│                   │
└──────┬───────────┘                   │
       │ 6. Return permissions          │
       └────────────────────────────────┤
                                        │
       ┌────────────────────────────────┘
       │ 7. Cache result in Valkey
       ▼
┌──────────────────┐
│  Permission Check│
│  canCreate=true? │
└──────┬───────────┘
       │ 8. YES → Allow
       ▼
┌──────────────────┐
│  Controller      │
│  create()        │
└──────────────────┘
```

---

## 6. Seed Data Example

```typescript
// prisma/seed.ts

import { PrismaClient, PermissionScope } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Admin User with Full Permissions
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@vivero.com',
      password: await bcrypt.hash('admin-password-123', 10),
    },
  });

  // Grant admin full access to all tables
  const tables = ['plants', 'greenhouses', 'reports', 'users'];
  for (const tableName of tables) {
    await prisma.userPermission.upsert({
      where: {
        userId_tableName: { userId: admin.id, tableName },
      },
      update: {},
      create: {
        userId: admin.id,
        tableName,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        scope: PermissionScope.ALL,
      },
    });
  }

  console.log('✅ Admin created with full permissions on all tables');

  // 2. Create Regular User with Full Access to Plants
  const john = await prisma.user.upsert({
    where: { username: 'john' },
    update: {},
    create: {
      username: 'john',
      email: 'john@vivero.com',
      password: await bcrypt.hash('password123', 10),
      isRoot: false,
    },
  });

  await prisma.userPermission.upsert({
    where: {
      userId_tableName: { userId: john.id, tableName: 'plants' },
    },
    update: {},
    create: {
      userId: john.id,
      tableName: 'plants',
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      scope: PermissionScope.ALL, // Can see all plants
    },
  });

  console.log('✅ John created with ALL scope on plants');

  // 3. Create Limited User (OWN scope only)
  const jane = await prisma.user.upsert({
    where: { username: 'jane' },
    update: {},
    create: {
      username: 'jane',
      email: 'jane@vivero.com',
      password: await bcrypt.hash('password123', 10),
      isRoot: false,
    },
  });

  await prisma.userPermission.upsert({
    where: {
      userId_tableName: { userId: jane.id, tableName: 'plants' },
    },
    update: {},
    create: {
      userId: jane.id,
      tableName: 'plants',
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false, // Cannot delete
      scope: PermissionScope.OWN, // Can only see own plants
    },
  });

  console.log('✅ Jane created with OWN scope on plants (no delete)');

  // 4. Create Read-Only User
  const bob = await prisma.user.upsert({
    where: { username: 'bob' },
    update: {},
    create: {
      username: 'bob',
      email: 'bob@vivero.com',
      password: await bcrypt.hash('password123', 10),
      isRoot: false,
    },
  });

  await prisma.userPermission.upsert({
    where: {
      userId_tableName: { userId: bob.id, tableName: 'plants' },
    },
    update: {},
    create: {
      userId: bob.id,
      tableName: 'plants',
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      scope: PermissionScope.ALL, // Read all, but cannot modify
    },
  });

  console.log('✅ Bob created with read-only access to all plants');

  // 5. Create some test plants
  await prisma.plant.createMany({
    data: [
      {
        name: 'Tomato Plant',
        species: 'Solanum lycopersicum',
        location: 'Greenhouse A',
        createdById: john.id,
      },
      {
        name: 'Basil',
        species: 'Ocimum basilicum',
        location: 'Greenhouse B',
        createdById: jane.id,
      },
    ],
  });

  console.log('✅ Test plants created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run seed:**
```bash
pnpm db:seed
```

---

## 7. Cache Strategy

### 7.1 Cache Service (Valkey)

```typescript
// src/cache/cache.service.ts

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private client: Redis;

  constructor(private config: ConfigService) {
    this.client = new Redis(config.get('VALKEY_URL'));
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.client.setex(key, ttl, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }
}
```

### 7.2 Cache Invalidation

**When to invalidate:**
- User permissions are granted/revoked
- User is deleted
- Manual invalidation endpoint (admin)

```typescript
// Example: Admin endpoint to flush user cache
@Post('permissions/invalidate/:userId')
@UseGuards(JwtAuthGuard, RootGuard)
async invalidateUserCache(@Param('userId') userId: string) {
  await this.permissionsService.invalidateCache(userId);
  return { message: 'Cache invalidated' };
}
```

---

## 8. Frontend Login Flow

### 8.1 Login Component

```typescript
// src/app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      
      // Store token
      localStorage.set