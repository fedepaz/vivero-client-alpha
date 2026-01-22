// app/modules/users/repositories/users.repository.ts

import { Injectable } from '@nestjs/common';
import { UpdateUserProfileDto } from '@vivero/shared';
import { User } from '../../../generated/prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  updateProfile(id: string, data: UpdateUserProfileDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  findByTenantId(tenantId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        tenantId,
      },
    });
  }
}
