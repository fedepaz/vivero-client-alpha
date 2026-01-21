// src/infra/prisma/prisma.service.ts

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const url = configService.get<string>('config.database.databaseUrl');

    if (!url) {
      throw new Error('DATABASE_URL not found in .env file');
    }
    const adapter = new PrismaMariaDb(url);

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      const testQuery = await this.user.findFirst();
      this.logger.log('✅ DATABASE CONNECTION SUCCESSFUL');
      this.logger.log(
        `   Database: ${this.configService.get<string>('config.database.name')}`,
      );
      this.logger.log(
        `   Sample data check: ${testQuery ? 'Data exists' : 'Empty database (normal for first run)'}`,
      );
    } catch (error) {
      this.logger.error('❌ DATABASE CONNECTION FAILED');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`   Error: ${error.message}`);
      this.logger.error(`   Check your DATABASE_URL in .env file`);
      process.exit(1); // Crash immediately - no point continuing
    }
  }
}
