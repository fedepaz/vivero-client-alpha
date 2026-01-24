// src/auth/user/userAuth.repository.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Tenant, User } from '../../../generated/prisma/client';
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

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        username,
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

  async createUser(data: {
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    passwordHash: string;
    tenantId: string;
  }): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          isActive: true,
        },
      });

      await this.prisma.userPermission.upsert({
        where: { userId_tableName: { userId: user.id, tableName: 'users' } },
        create: {
          userId: user.id,
          tableName: 'users',
          canRead: true,
          scope: 'OWN',
        },
        update: { canRead: true, scope: 'OWN' },
      });
      return user;
    } catch (error) {
      console.error('Error granting user permissions:', error);
      throw new InternalServerErrorException('Error creating user');
    }
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
