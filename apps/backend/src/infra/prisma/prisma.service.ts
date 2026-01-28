// src/infra/prisma/prisma.service.ts

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const host = configService.get<string>('config.database.host');
    const port = configService.get<number>('config.database.port');
    const user = configService.get<string>('config.database.username');
    const password = configService.get<string>('config.database.password');
    const database = configService.get<string>('config.database.name');

    const certFromEnv = process.env.DATABASE_SSL_CERT;

    let serverCert: string;
    try {
      if (!certFromEnv) throw new Error('Cert not found in env');
      serverCert = Buffer.from(certFromEnv, 'base64').toString('utf8');
    } catch (error) {
      console.error('Error reading cert file:', error);
      throw new Error('Cert not found in file');
    }

    const adapter = new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database,
      ssl: {
        ca: serverCert,
        rejectUnauthorized: true, // Set to false only for testing
      },
      connectionLimit: 2,
    });

    super({ adapter, log: ['info', 'warn', 'error'] });
  }

  async onModuleInit() {
    this.logger.log(' DATABASE CONNECTION STARTED ON >>>>>> ');
    this.logger.warn(this.configService.get<string>('config.database.host'));
    this.logger.warn(this.configService.get<string>('config.database.port'));
    this.logger.warn(
      this.configService.get<string>('config.database.username'),
    );
    this.logger.warn(
      this.configService.get<string>('config.database.password'),
    );
    this.logger.warn(this.configService.get<string>('config.database.name'));
    this.logger.warn(process.env.NODE_EXTRA_CA_CERTS);

    try {
      await this.$connect();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        this.logger.error('❌ DATABASE CONNECTION FAILED');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.logger.error(`   Error: ${error.message}`);
        this.logger.error(error);
        process.exit(1); // Crash immediately - no point continuing
      } else {
        this.logger.error('❌ DATABASE CONNECTION FAILED');
        throw error;
      }
    }
    this.logger.log('✅ DATABASE CONNECTION SUCCESSFUL');
    this.logger.log(
      `   Database: ${this.configService.get<string>('config.database.name')}`,
    );
  }
}
