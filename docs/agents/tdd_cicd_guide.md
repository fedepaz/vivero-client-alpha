vivero-client-alpha
TDD & CI/CD Guide for "Chill Mode" Development 😎
Philosophy: Write tests so good that you sleep peacefully knowing your 3-4 enterprise clients are happy and your app won't wake you up at 3 AM.

---

## Testing Strategy

### Collaboration Model

- **`agricultural-frontend-specialist`**: Responsible for writing **unit and component tests** for all new and modified components. These tests should be colocated with the feature in its `__tests__/` subdirectory and focus on component logic, props, and states.
- **`agricultural-qa-test-automation-engineer`**: Responsible for building and maintaining the comprehensive **E2E test suite** using Playwright. This includes testing critical user journeys, agricultural workflows, and multi-tenant interactions.

### Implementation Guides

For technology-specific implementation details, refer to the relevant agent guide:

- **Frontend:** See the [Frontend Component Testing Standards](./frontend-agent-guide.md#frontend-component-testing-standards) in the `frontend-agent-guide.md`.
- **Backend:** The backend testing stack and patterns are detailed below.

---

## The "Sleep Well" Testing Pyramid

- **E2E (5% - Critical user flows)**: Owned by the `agricultural-qa-test-automation-engineer`. Covers critical paths like trial signup and plant lifecycle management.
- **Integration (15% - API contracts & component interactions)**: A shared responsibility. The `agricultural-qa-test-automation-engineer` focuses on cross-system API contract tests, while developers test interactions between their components and services.
- **Unit (80% - Business logic & components)**: Owned by developers. Every piece of business logic and every UI component must have unit tests.

## Testing Philosophy

Rule #1: If it can break at 3 AM and wake you up, it needs a test.
Rule #2: If a client can lose money because of it, it needs integration tests, validated by the `agricultural-qa-test-automation-engineer`.
Rule #3: If it's business logic, it needs unit tests written by the developer.

## Frontend Testing Stack

### Setup

# Testing dependencies

pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D @testing-library/user-event vitest jsdom
pnpm add -D @playwright/test

### Unit Tests (80% of tests)

// components/**tests**/PlantCard.test.tsx
import { render, screen } from '@testing-library/react'
import { PlantCard } from '../PlantCard'

describe('PlantCard', () => {
it('displays plant information correctly', () => {
const plant = {
id: '1',
name: 'Tulip Red',
status: 'growing',
temperature: 22,
daysToHarvest: 45
}

    render(<PlantCard plant={plant} />)

    expect(screen.getByText('Tulip Red')).toBeInTheDocument()
    expect(screen.getByText('22°C')).toBeInTheDocument()
    expect(screen.getByText('45 days')).toBeInTheDocument()

})

it('shows critical temperature warning', () => {
const plant = { ...mockPlant, temperature: 35 }
render(<PlantCard plant={plant} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Critical temperature')

})
})

### Integration Tests (15% of tests)

// hooks/**tests**/usePlants.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePlants } from '../usePlants'

const createWrapper = () => {
const queryClient = new QueryClient({
defaultOptions: { queries: { retry: false } }
})
return ({ children }) => (
<QueryClientProvider client={queryClient}>
{children}
</QueryClientProvider>
)
}

describe('usePlants', () => {
it('fetches plants data correctly', async () => {
const { result } = renderHook(() => usePlants('tenant-1'), {
wrapper: createWrapper()
})

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toHaveLength(10)
    expect(result.current.data[0]).toHaveProperty('name')

})
})

### E2E Tests (5% of tests - Critical flows)

// e2e/plant-lifecycle.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Plant Lifecycle Management', () => {
test.beforeEach(async ({ page }) => {
await page.goto('/login')
await page.fill('[data-testid=email]', 'admin@tulips-nl.com')
await page.fill('[data-testid=password]', 'test123')
await page.click('[data-testid=login-button]')
})

test('complete plant lifecycle: create → grow → harvest', async ({ page }) => {
// Create plant
await page.click('[data-testid=create-plant]')
await page.fill('[data-testid=plant-name]', 'Test Tulip')
await page.selectOption('[data-testid=plant-type]', 'tulip-red')
await page.click('[data-testid=save-plant]')

    await expect(page.locator('[data-testid=plant-card]')).toContainText('Test Tulip')

    // Update growth data
    await page.click('[data-testid=update-plant]')
    await page.fill('[data-testid=temperature]', '22')
    await page.fill('[data-testid=humidity]', '65')
    await page.click('[data-testid=save-update]')

    // Verify dashboard updates
    await expect(page.locator('[data-testid=dashboard-temperature]')).toContainText('22°C')

})

test('handles critical temperature alerts', async ({ page }) => {
await page.goto('/plants/critical-temp-plant')

    // Should show alert for high temperature
    await expect(page.locator('[role=alert]')).toBeVisible()
    await expect(page.locator('[role=alert]')).toContainText('Critical temperature')

})
})

## Backend Testing Stack

### NestJS Test Setup

// test/setup.ts
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from '../src/infra/prisma/prisma.service'

export const createTestModule = async (providers: any[] = []) => {
const moduleRef: TestingModule = await Test.createTestingModule({
imports: [ConfigModule.forRoot({ isGlobal: true })],
providers: [PrismaService, ...providers],
}).compile()

return moduleRef
}

// Global test database setup
beforeAll(async () => {
// Run test migrations
execSync('pnpx prisma migrate deploy', {
env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL }
})
})

afterEach(async () => {
// Clean test database
await prisma.plant.deleteMany()
await prisma.user.deleteMany()
})

### Unit Tests - Services

// src/modules/plants/plants.service.spec.ts
describe('PlantsService', () = > {
let service: PlantsService
let prisma: PrismaService

beforeEach(async () = > {
const module = await createTestModule([PlantsService])
service = module.get <PlantsService >(PlantsService)
prisma = module.get <PrismaService >(PrismaService)
})

describe('createPlant', () = > {
it('creates a plant with correct data', async () = > {
const plantData = {
name: 'Test Tulip',
type: 'tulip',
tenantId: 'tenant-1'
}

      const result = await service.createPlant(plantData)

       expect(result).toMatchObject({
        name: 'Test Tulip',
        type: 'tulip',
        status: 'planted'
      })

      // Verify database state
      const dbPlant = await  prisma.plant.findUnique({ where: { id: result.id } })
      expect(dbPlant.name).toBe('Test Tulip')
    })

    it('validates plant data correctly', async () = > {
      const invalidData = { name: '', type: 'invalid' }

      await expect(service.createPlant(invalidData)).rejects.toThrow('Invalid plant data')
    })

})

describe('get CriticalPlants', () = > {
it('returns plants with critical conditions', async () = > {
// Seed test data
await prisma.plant.createMany({
data: [
{ name: 'Normal Plant', temperature: 22, tenantId: 'tenant-1' },
{ name: 'Hot Plant', temperature: 35, tenantId: 'tenant-1' },
{ name: 'Cold Plant', temperature: 5, tenantId: 'tenant-1' }
]
})

      const criticalPlants = await servi ce.getCriticalPlants('tenant-1')

      expect(criticalPlants).toHaveLength(2)
      expect(criticalPlants.map(p = > p.name)).toEqual(['Hot Plant', 'Cold Plant'])
    })

})
})

### Integration Tests - Controllers

// src/modules/plants/plants.controller.spec.ts
describe('PlantsController (Integration)', () = > {
let app: INestApplication
let prisma: PrismaService

beforeAll(async () = > {
const moduleRef = await Test.createTestingModule({
imports: [AppModule],
}).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    p risma = app.get(PrismaService)

})

describe('/plants (GET)', () = > {
it('returns plants for authenticated user', async () = > {
const jwt = await getValidJWT('tenant-1', 'admin')

      await request(app.getHttpServer())
        .get('/api/v1/tenant-1/plants')
        .set('Authorization', ` Bearer ${jwt}`)
        .expect(200)
        .expect((res) = > {
          expect(res.body).toHaveProperty('data')
          expect(Array.isArray(res.body.data)).toBe(true)
        })
    })

    it('rejects requests without proper tenant ac cess', async () = > {
      const jwt = await getValidJWT('tenant-2', 'admin')

      await request(app.getHttpServer())
        .get('/api/v1/tenant-1/plants')
        .set('Authorization', ` Bearer ${jwt}`)
        .expect(403)
    })

})

describe('/plants (POST)', () = > {
it('creates plant with valid data', async () = > {
const jwt = await getValidJWT('tenant-1', 'admin')
const plantData = {
name: 'Integration Test Plant',
type: 'tulip',
variety: 'red'
}

      await request(app.getHttpServer())
        .post('/api/v1/tenant-1/plants')
        .set('Authorization', `Bearer ${jwt}`)
        .send(plantData)
        .expect(201)
         .expect((res) = > {
          expect(res.body.name).toBe('Integration Test Plant')
          expect(res.body.id).toBeDefined()
        })
    })

})
})

## CI/CD Pipeline Configuration

The canonical CI/CD workflow structure is defined in the `docs/agents/cicd_agent.md` document. It outlines the modern, 4-file approach for managing workflows in this project:

1.  `pr-checks.yml` (For Quality Assurance)
2.  `deploy.yml` (For Deployments)
3.  `scheduled.yml` (For Maintenance)
4.  `reusable-setup.yml` (For common, shared steps)

A critical part of the `pr-checks.yml` workflow is the validation of the `@plant-mgmt/shared` package. Any pull request **must** trigger linting and unit tests on the shared package to prevent breaking changes to the data contracts from being merged. This is managed by the `agricultural-shared-package-engineer`.

Always refer to `cicd_agent.md` for the authoritative implementation details.

## Package.json Scripts

{
"scripts ": {
"dev ": "concurrently "pnpm dev:\*" ",
"dev:frontend ": "next dev ",
"dev:backend ": "nest start --watch ",

     "build ":  "pnpm run build:frontend  & & pnpm run build:backend ",
     "build:frontend ":  "next build ",
     "build:backend ":  "nest build ",

     "test ":  "pnpm run test:unit  & & pnpm run test:integration  & & pnpm run test:e2e ",
     "test:unit ":  "vitest run --coverage ",
     "test:unit:watch ":  "vitest ",
     "test:integration ":  "jest --config jest.integration.config.js ",
     "test:e2e ":  "playwright test ",
     "test:e2e:staging ":  "playwright test --config playwright.staging.config.ts ",

     "lint ":  "next lint  & & eslint "src/**/*.{js,ts}" ",
     "format ":  "prettier --write . ",
     "format:check ":  "prettier --check . ",
     "type-check ":  "tsc --noEmit ",

     "db:migrate ":  "prisma migrate dev ",
     "db:migrate:test ":  "dotenv -e .env.test prisma migrate deploy ",
     "db:migrate:prod ":  "prisma migrate deploy ",
     "db:seed ":  "ts-node prisma/seed.ts ",
     "db:studio ":  "prisma studio ",

     "docker:build ":  "docker build -t plant-mgmt . ",
     "docker:run ":  "docker-compose up -d "

}
}

## Quality Gates & Metrics

### Code Coverage Requirements

// vitest.config.ts
export default defineConfig({
test: {
coverage: {
provider: 'v8',
reporter: ['text', 'lcov', 'html'],
thresholds: {
global: {
branches: 80,
functions: 80,
lines: 80,
statements: 80
}
},
exclude: [
'dist/**',
'node_modules/**',
'**/*.d.ts',
'**/*.config.{js,ts}',
'**/migrations/**'
]
}
}
})

### Performance Budgets

// next.config.js
module.exports = {
experimental: {
bundleAnalyzer: {
enabled: process.env.ANALYZE === 'true',
}
},
// Performance budgets
webpack: (config, { dev, isServer }) => {
if (!dev && !isServer) {
config.optimization.splitChunks.cacheGroups.default.minSize = 20000;
config.optimization.splitChunks.cacheGroups.default.maxSize = 244000;
}
return config;
}
}

### Database Migration Safety

-- migrations/migration-template.sql
-- Migration: {{ migration_name }}
-- Date: {{ date }}
-- Author: {{ author }}

-- Safety checks
SET foreign_key_checks = 0;

-- Begin transaction
START TRANSACTION;

-- Your migration here
{{ migration_sql }}

-- Rollback plan (commented)
-- {{ rollback_sql }}

-- Commit
COMMIT;
SET foreign_key_checks = 1;

## Monitoring & Alerting Integration

### Health Check Endpoints

// src/health/health.controller.ts
@Controller('health')
export class HealthController {
constructor(
private health: HealthCheckService,
private db: TypeOrmHealthIndicator,
private valkey: RedisHealthIndicator,
) {}

@Get()
@HealthCheck()
check() {
return this.health.check([
() => this.db.pingCheck('database'),
() => this.valkey.isHealthy('valkey'),
() => this.customHealthCheck(),
]);
}

private async customHealthCheck(): Promise<HealthIndicatorResult> {
const isHealthy = await this.checkCriticalSystemHealth();
const result = this.getStatus('custom', isHealthy);

    if (!isHealthy) {
      throw new HealthCheckError('Custom health check failed', result);
    }

    return result;

}
}

## Deployment Verification

#!/bin/bash

# scripts/verify-deployment.sh

echo "🚀 Starting deployment verification..."

# Health check

echo "⚕️ Checking health endpoint..."
curl -f https://api.plant-mgmt.com/health || exit 1

# Database connectivity

echo "🗄️ Checking database..."
pnpm run db:health-check || exit 1

# Valkey connectivity

echo "⚡ Checking Valkey..."
valkey-cli ping || exit 1

# Smoke tests

echo "🔥 Running smoke tests..."
pnpm run test:smoke || exit 1

echo "✅ Deployment verification completed successfully!"

## The "Chill Mode" Checklist ✅

### Before you deploy to production:

[ ] Unit test coverage > 80%
[ ] Integration tests cover all API endpoints
[ ] E2E tests cover critical user journeys
[ ] Security scan passes
[ ] Performance tests pass
[ ] Database migrations tested
[ ] Rollback plan documented
[ ] Monitoring alerts configured
[ ] Health checks implemented
[ ] Staging environment tested

### After deployment:

[ ] Smoke tests pass
[ ] Monitoring dashboards showing green
[ ] Error rates < 0.1%
[ ] Response times < 200ms
[ ] All services healthy

### For true "chill mode":

[ ] Automated rollback on failure
[ ] 24/7 monitoring alerts to phone
[ ] Backup verification automated
[ ] Client SLA monitoring
[ ] Revenue impact alerts
Remember: The goal is to build it once, test it thoroughly, and then just monitor the money coming in while your enterprise clients are happy. 💰😎
This setup gives you the confidence to sleep well knowing your system is bulletproof and your clients are getting enterprise-grade reliability.
