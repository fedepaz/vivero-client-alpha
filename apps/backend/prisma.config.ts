// backend/prisma.config.ts

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL || process.env.DATABASE_DOCKER_URL || '',
  },
});
