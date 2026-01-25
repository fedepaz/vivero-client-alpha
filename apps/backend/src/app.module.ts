// src/app.module.ts

import { Module } from '@nestjs/common';
import { configuration, validationSchema } from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/prisma/prisma.module';
import { HealthController } from './modules/health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { SecurityExceptionFilter } from './shared/exceptions/security-exception.filter';
import { GlobalAuthGuard } from './modules/auth/guards/global-auth.guard';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { UsersRepository } from './modules/users/repositories/users.repository';
import { AuthController } from './modules/auth/auth.controller';
import { PermissionsGuard } from './modules/permissions/guards/permissions.guard';
import { PermissionsService } from './modules/permissions/permissions.service';
import { PermissionsRepository } from './modules/permissions/repositories/permissions.repository';
import { PermissionsController } from './modules/permissions/permissions.controller';
import { AuditLogController } from './modules/auditLog/auditLog.controller';
import { AuditLogService } from './modules/auditLog/auditLog.service';
import { AuditLogRepository } from './modules/auditLog/repositories/auditLog.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [
    HealthController,
    UsersController,
    AuthController,
    PermissionsController,
    AuditLogController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SecurityExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    UsersService,
    UsersRepository,
    PermissionsService,
    PermissionsRepository,
    AuditLogService,
    AuditLogRepository,
  ],
  exports: [UsersService],
})
export class AppModule {}
