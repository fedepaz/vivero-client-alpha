// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port =
    Number(process.env.PORT) ||
    configService.get<number>('config.port') ||
    3000;
  const isProd =
    configService.get<string>('config.environment') === 'production';
  const corsOrigins = configService
    .get<string>('config.cors.origins', '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: isProd ? corsOrigins : true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  });
  await app.listen(port, '0.0.0.0');
  console.log('🚀 Backend started', {
    port,
    environment: isProd ? 'production' : 'development',
    corsOrigins,
  });
}
void bootstrap();
