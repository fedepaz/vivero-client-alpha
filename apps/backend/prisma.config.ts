// backend/prisma.config.ts

import * as dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';

dotenv.config();
export default defineConfig({
  schema: 'prisma/',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL') || process.env.DATABASE_DOCKER_URL,
  },
});
