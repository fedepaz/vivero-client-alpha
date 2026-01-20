// apps/backend/src/config/configuration.ts
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// Define a strict type for our configuration
export type AppConfig = {
  environment: string;
  port: number;
  url: string;
  cors: {
    origins: string;
  };
  database: {
    name: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
    databaseUrl: string;
  };
  valkey: {
    host: string;
    port: number;
    password?: string;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    expiresIn: string;
  };

  awsS3: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
  sendgrid: {
    apiKey: string;
  };
  defaultTenantId: string;
};

// Create a typed factory function
const configFactory = (): AppConfig => ({
  environment: process.env.BACKEND_NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  url: process.env.URL || 'http://localhost:3001',
  cors: {
    origins: process.env.CORS_ORIGINS || '',
  },
  database: {
    name: process.env.DATABASE_NAME || 'vivero_client_alpha',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USERNAME || 'user',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'vivero_client_alpha',
    databaseUrl: process.env.DATABASE_URL || '',
    ssl: process.env.DATABASE_SSL === 'true',
  },
  valkey: {
    host: process.env.VALKEY_HOST || 'localhost',
    port: parseInt(process.env.VALKEY_PORT || '6379', 10),
    password: process.env.VALKEY_PASSWORD,
  },
  jwt: {
    secret:
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      'your-super-secret-refresh-jwt-key-change-in-prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },

  awsS3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.AWS_S3_BUCKET || 'plant-mgmt-files',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
  },
  defaultTenantId: process.env.DEFAULT_TENANT_ID || '',
});

// Export the final configuration
export const configuration = registerAs<AppConfig>('config', configFactory);

// Joi validation schema
export const validationSchema = Joi.object({
  BACKEND_NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().port().default(3001),
  URL: Joi.string().uri().optional(),
  CORS_ORIGINS: Joi.string().optional(),

  DATABASE_HOST: Joi.string().hostname().required(),
  DATABASE_PORT: Joi.number().port().default(3306),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SSL: Joi.boolean().default(false),
  DATABASE_URL: Joi.string().optional(),

  VALKEY_HOST: Joi.string().hostname().default('localhost'),
  VALKEY_PORT: Joi.number().port().default(6379),
  VALKEY_PASSWORD: Joi.string().optional().allow(''),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),

  AWS_ACCESS_KEY_ID: Joi.string().optional().allow(''),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional().allow(''),
  AWS_REGION: Joi.string().optional().allow(''),
  AWS_S3_BUCKET: Joi.string().optional().allow(''),

  SENDGRID_API_KEY: Joi.string().optional().allow(''),

  DEFAULT_TENANT_ID: Joi.string().optional().allow(''),
});
