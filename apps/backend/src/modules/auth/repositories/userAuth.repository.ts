// src/auth/user/userAuth.repository.ts

import { Injectable } from '@nestjs/common';
import { Role, Tenant, User } from '../../../generated/prisma/client';

import { PrismaService } from '../../../infra/prisma/prisma.service';

@Injectable()
export class UserAuthRepository {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findAllByTenantId(tenantId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        tenantId,
      },
    });
  }

  findTenantById(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: {
        id,
      },
    });
  }

  findRoleById(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: {
        id,
      },
    });
  }

  createUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    tenantId: string;
    roleId: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        isActive: true,
      },
    });
  }

  updateUser(
    id: string,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      passwordHash?: string;
    },
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
