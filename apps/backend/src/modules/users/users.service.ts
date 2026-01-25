// app/modules/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { UpdateUserProfileDto } from '@vivero/shared';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async getProfile(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async gerUserById(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, data: UpdateUserProfileDto) {
    return this.repo.updateProfile(userId, data);
  }

  async getAllUsers() {
    const users = await this.repo.findAll();
    if (!users) throw new NotFoundException('Users not found');
    return users;
  }

  async getUserByUsername(username: string) {
    const user = await this.repo.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserByTenantId(tenantId: string) {
    const users = await this.repo.findByTenantId(tenantId);
    if (!users) throw new NotFoundException('Users not found');
    return users;
  }
}
