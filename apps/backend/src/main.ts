// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  console.log('🟡 BOOTSTRAP START');

  console.log('🟡 process.env.PORT =', process.env.PORT);
  console.log('🟡 NODE_ENV =', process.env.NODE_ENV);
  console.log('🟡 BACKEND_NODE_ENV =', process.env.BACKEND_NODE_ENV);
  const app = await NestFactory.create(AppModule);
  console.log('🟢 NestFactory.create OK');

  const configService = app.get(ConfigService);
  console.log('🟢 ConfigService OK');

  const port = Number(process.env.PORT);
  console.log('🟡 RESOLVED PORT =', port);

  const isProd =
    configService.get<string>('config.environment') === 'production';
  console.log('🟡 isProd =', isProd);

  const corsOrigins = configService
    .get<string>('config.cors.origins', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  console.log('🟡 corsOrigins =', corsOrigins);

  app.enableCors({
    origin: isProd ? corsOrigins : true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  });
  try {
    await app.listen(port, '0.0.0.0');
    console.log('🚀 Backend started', {
      port,
      environment: isProd ? 'production' : 'development',
      corsOrigins,
    });
  } catch (error) {
    console.error('❌ BACKEND STARTUP FAILED');
    console.error(`   Error: ${error}`);
    process.exit(1); // Crash immediately - no point continuing
  }
}
void bootstrap();
