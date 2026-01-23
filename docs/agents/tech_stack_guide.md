# TECH-STACK.md - vivero-client-alpha

## 🎯 Mission Statement
Build a bulletproof, enterprise-grade plant management system that converts 30-day trials into €50k+ annual contracts while you sleep peacefully knowing nothing will break at 3 AM.

---

## 🏗️ Core Technology Stack

### Frontend Stack
```typescript
Framework: Next.js 14+ (App Router)
├── UI Foundation: Tailwind CSS
├── Component Registry: shadcn/ui
├── Icons: Lucide React
├── State Management: TanStack Query (React Query)
├── Tables/Grids: TanStack Table + AG Grid Enterprise (optional)
├── Forms: React Hook Form + Zod validation
├── Charts: Recharts + Tremor
├── Authentication: Custom username/password with database
└── Styling: Tailwind CSS + MUI theming

**Architectural Note**: The combination of Next.js 14 (with React Suspense) and TanStack Query is intentionally chosen to facilitate modern data fetching patterns. This stack enables the implementation of sophisticated and user-friendly loading states, such as skeleton screens, which are a core requirement for providing a high-quality, responsive user experience.
```

### Backend Stack
```typescript
Framework: NestJS (TypeScript-first)
├── Database ORM: Prisma
├── Database: MariaDB 10.9+
├── Authentication: Manages users, permissions, and session tokens
├── Caching: Valkey (Redis 7+ compatible fork)
├── Queue System: BullMQ (Valkey/Redis-based)
├── File Storage: AWS S3 compatible
├── Email: SendGrid / AWS SES
├── Background Jobs: Node.js workers
└── API Documentation: Swagger/OpenAPI
```

### Infrastructure & DevOps
```yaml
Package Manager: pnpm 8+
Container Runtime: Docker + Docker Compose
Orchestration: Kubernetes + Helm
Infrastructure as Code: Terraform
CI/CD: GitHub Actions
Monitoring: DataDog / New Relic
Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
Error Tracking: Sentry
Metrics: Prometheus + Grafana
Tracing: OpenTelemetry + Jaeger
Load Balancer: Nginx / Cloudflare
CDN: Cloudflare / AWS CloudFront
```

### Testing Stack
```typescript
Unit Testing: Vitest + Testing Library
Integration Testing: Jest + Supertest
E2E Testing: Playwright
Load Testing: k6
Security Testing: OWASP ZAP
Coverage: Vitest coverage (80%+ required)
```

---

## 📦 Package.json Dependencies

### Frontend Dependencies
```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    
    // shadcn/ui dependencies
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    
    // Icons
    "lucide-react": "^0.263.0",
    
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    
    "@tanstack/react-query": "^5.17.0",
    "@tanstack/react-table": "^8.11.0",
    
    "ag-grid-react": "^31.0.0",
    "ag-grid-enterprise": "^31.0.0",
    
    "recharts": "^2.9.0",
    "@tremor/react": "^3.14.0",
    
    "date-fns": "^3.0.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "@types/lodash": "^4.14.202",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "prettier": "^3.1.0",
    "@tailwindcss/typography": "^0.5.10",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "@nestjs/core": "^10.3.0",
    "@nestjs/common": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/config": "^3.1.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/swagger": "^7.2.0",
    "@nestjs/throttler": "^5.1.0",
    "@nestjs/bull": "^10.0.0",
    "@nestjs/terminus": "^10.2.0",
    "@prisma/client": "^5.8.0",
    "prisma": "^5.8.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bull": "^4.12.0",
    "bullmq": "^5.1.0",
    "redis": "^4.6.0",
    "ioredis": "^5.3.0",
    "bcryptjs": "^2.4.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "winston": "^3.11.0",
    "@prisma/adapter-mariadb": "^5.8.0",
    "@sendgrid/mail": "^8.1.0",
    "aws-sdk": "^2.1532.0",
    "date-fns": "^3.0.0",
    "lodash": "^4.17.21",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/schematics": "^10.1.0",
    "@nestjs/testing": "^10.3.0",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.0",
    "@types/passport-jwt": "^4.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/compression": "^1.7.5",
    "@types/lodash": "^4.14.202",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.0"
  }
}
```

### Testing & Development Dependencies
```json
{
  "devDependencies": {
    "vitest": "^1.2.0",
    "@vitest/coverage-v8": "^1.2.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.2.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^23.2.0",
    "playwright": "^1.41.0",
    "@playwright/test": "^1.41.0",
    "k6": "^0.48.0",
    "concurrently": "^8.2.0",
    "husky": "^8.0.3",
    "@commitlint/cli": "^20.0.0",
    "@commitlint/config-conventional": "^20.0.0",
    "lint-staged": "^15.2.0",
    "dotenv-cli": "^7.3.0",
    "tsx": "^4.7.0"
  }
}
```

---

## 🏛️ Architecture Decisions

### Multi-Tenancy Strategy
```typescript
Pattern: Database-per-tenant (maximum isolation)

Rationale:
✅ Complete data isolation (security requirement)
✅ Easy backup/restore per client
✅ Custom schemas per tenant possible
✅ Regulatory compliance (GDPR)
❌ More complex deployment
❌ Higher infrastructure costs
✅ Worth it for enterprise clients paying €50k+
```

### Authentication Strategy
```typescript
Authentication Workflow:

The platform uses a traditional username/password authentication model managed by the backend.

1.  **Frontend (Next.js):** Provides the UI for login (username, password fields). When a user submits the login form, the frontend sends a request to the backend's `/auth/login` endpoint.

2.  **API Requests:** After a successful login, the backend returns a JWT (JSON Web Token). The frontend must store this token securely (e.g., in an HttpOnly cookie or local storage) and include it in the `Authorization: Bearer <token>` header for all subsequent API requests.

3.  **Backend (NestJS):** The backend is responsible for:
    - Verifying user credentials against the database.
    - Generating and signing JWTs upon successful login.
    - Validating the JWT on every incoming request to protected endpoints.
    - Managing user sessions and permissions based on the token's payload.
```

### Caching Strategy
```typescript
Multi-Level Caching:

L1: React Query (browser cache) - 5 minutes
L2: Valkey (server cache) - 1 hour
L3: Database query optimization - indexes
L4: CDN (static assets) - 30 days
```

### Data Flow Architecture
```
Landing Page → Trial Signup → Tenant Provisioning → Usage Analytics → Lead Scoring → Sales Conversion
```

---

## 🚀 Development Environment Setup

### Prerequisites
```bash
# Required software versions
Node.js: 18.18.0+
pnpm: 8.15.0+
Docker: 24.0+
MariaDB: 10.9+
Valkey: 7.2+
```

### Initial Setup Commands
```bash
# Clone and setup
git clone <repository>
cd vivero-client-alpha

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
cp .env.test.example .env.test

# Start development services
docker-compose up -d

# Database setup
pnpm db:migrate
pnpm db:seed

# Start development servers
pnpm dev
```

### Development Scripts
```json
{
  "scripts": {
    // Development
    "dev": "concurrently \"pnpm:dev:*\"",
    "dev:frontend": "next dev -p 3000",
    "dev:backend": "nest start --watch -p 3001",
    "dev:docs": "swagger-ui serve docs/openapi.json -p 3002",
    
    // Building
    "build": "pnpm build:frontend && pnpm build:backend",
    "build:frontend": "next build",
    "build:backend": "nest build",
    "build:docker": "docker build -t plant-mgmt:latest .",
    
    // Testing
    "test": "pnpm test:unit && pnpm test:integration",
    "test:unit": "vitest run --coverage",
    "test:integration": "jest --config jest.integration.js",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:load": "k6 run tests/load/api-load-test.js",
    
    // Database
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset --force",
    
    // Linting & Formatting
    "lint": "next lint && eslint \"src/**/*.{js,ts}\"",
    "lint:fix": "next lint --fix && eslint \"src/**/*.{js,ts}\" --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    
    // Trial Management
    "trial:create": "tsx scripts/create-trial.ts",
    "trial:expire": "tsx scripts/expire-trials.ts",
    "trial:stats": "tsx scripts/trial-stats.ts",
    "trial:notify": "tsx scripts/notify-trial-ending.ts",
    
    // Production
    "start": "node dist/main.js",
    "start:prod": "NODE_ENV=production pnpm start"
  }
}
```

---

## 🔒 Security Configuration

### Environment Variables Template
```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/plant_mgmt"
DATABASE_URL_TEST="mysql://user:password@localhost:3306/plant_mgmt_test"

# Valkey
VALKEY_URL="valkey://localhost:6379"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-256-bits"

# External Services
SENDGRID_API_KEY="SG...."
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="plant-mgmt-files"

# Monitoring
SENTRY_DSN="https://...@sentry.io/..."
DATADOG_API_KEY="..."

# Business
STRIPE_SECRET_KEY="sk_..."
SLACK_WEBHOOK_URL="https://hooks.slack.com/..."

# Feature Flags
NODE_ENV="development" # development | staging | production
DEBUG_LOGGING="true"
TRIAL_DURATION_DAYS="30"
```

### Security Checklist
```typescript
✅ JWT tokens with short expiration (15 min access + refresh tokens)
✅ Rate limiting (100 requests/minute per IP)
✅ Input validation with Zod schemas
✅ SQL injection prevention (Prisma ORM)
✅ XSS protection (helmet middleware)
✅ CORS configuration
✅ Environment variable validation
✅ API key rotation strategy
✅ Audit logging for all data changes
✅ Encryption at rest (database + file storage)
✅ TLS 1.3 for all connections
✅ Regular dependency updates (Dependabot)
```

---

## 📊 Monitoring & Observability

### Key Metrics to Track
```typescript
Business Metrics:
- Trial conversion rate (target: 25%)
- Average lead score
- Trial usage patterns
- Revenue per customer
- Customer acquisition cost
- Time to first value (trial onboarding)

Technical Metrics:
- API response times (p95 < 200ms)
- Error rates (< 0.1%)
- Database query performance
- Cache hit rates
- Server resource usage
- Uptime (99.9% SLA)

User Experience Metrics:
- Page load times
- JavaScript errors
- User session duration
- Feature adoption rates
- Support ticket volume
```

### Alerting Rules
```yaml
Critical Alerts (Phone/SMS):
- API error rate > 1%
- Database connection failures
- Service downtime
- Trial system failures
- Payment processing errors

Warning Alerts (Slack):
- API response time > 500ms
- High memory usage (>80%)
- Failed background jobs
- Trial conversion drop
- Security scan failures

Info Alerts (Email):
- Daily trial report
- Weekly performance summary
- Monthly business metrics
- Dependency update notifications
```

---

## 🚢 Deployment Strategy

### Environment Pipeline
```
Development → Staging → Production
     ↓           ↓          ↓
   Localhost   Azure/AWS   Azure/AWS
   Local DB    Test DB     Prod DB
   Mock APIs   Staging APIs Live APIs
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --production=false

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Kubernetes Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: plant-mgmt-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: plant-mgmt
  template:
    metadata:
      labels:
        app: plant-mgmt
    spec:
      containers:
      - name: app
        image: plant-mgmt:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## 🎯 Performance Targets

### Response Time Requirements
```typescript
Target Performance (95th percentile):
- Landing pages: < 1 second
- Dashboard loads: < 2 seconds
- API endpoints: < 200ms
- Database queries: < 100ms
- Trial signup: < 3 seconds
- Plant creation: < 500ms
- Report generation: < 5 seconds
- File uploads: < 10 seconds
```

### Scalability Targets
```typescript
System Capacity:
- Concurrent users: 10,000+
- API requests/second: 1,000+
- Database connections: 500+
- Plants per tenant: 1,000,000+
- File storage: 10TB+
- Trial tenants: 1,000+ simultaneously
```

---

## 💰 Business Model Integration

### Pricing Tiers
```typescript
Trial (30 days):
- Full feature access
- Up to 10,000 plants
- 5 users max
- Standard support

Starter (€2,000/month):
- Up to 50,000 plants
- 20 users
- Standard features
- Email support

Professional (€5,000/month):
- Up to 500,000 plants
- Unlimited users
- Advanced analytics
- Priority support

Enterprise (€15,000+/month):
- Unlimited plants
- Custom features
- Dedicated support
- Self-hosting option
- Custom integrations
```

### Revenue Tracking
```typescript
Metrics to Track:
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Customer Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)
- Trial to paid conversion rate
- Monthly churn rate
- Net Promoter Score (NPS)
- Feature adoption rates
```

---

## ✅ Pre-Launch Checklist

### Technical Readiness
- [ ] All tests passing (unit, integration, E2E)
- [ ] Security audit completed
- [ ] Performance testing passed
- [ ] Load testing completed
- [ ] Database migrations tested
- [ ] Backup/restore procedures verified
- [ ] Monitoring dashboards configured
- [ ] Error tracking setup
- [ ] CDN configuration optimized
- [ ] SSL certificates configured

### Business Readiness
- [ ] Trial signup flow tested
- [ ] Payment processing integrated
- [ ] Legal terms updated
- [ ] Privacy policy compliant
- [ ] GDPR compliance verified
- [ ] Sales team trained
- [ ] Support documentation ready
- [ ] Customer onboarding process defined
- [ ] Marketing campaigns prepared

### Operational Readiness
- [ ] 24/7 monitoring alerts configured
- [ ] On-call rotation established
- [ ] Incident response procedures documented
- [ ] Backup monitoring automated
- [ ] Performance baseline established
- [ ] Capacity planning completed
- [ ] Disaster recovery plan tested
- [ ] Compliance audits scheduled
- [ ] Customer success team ready
- [ ] Revenue tracking implemented

---

## 🎉 Success Metrics

**Month 1 Targets:**
- 50+ trial signups
- 10% trial conversion rate
- 99.5% uptime
- < 2 second average page load

**Month 6 Targets:**
- 500+ trial signups
- 25% trial conversion rate
- 10 paying enterprise clients
- €500k ARR pipeline

**Year 1 Targets:**
- 25+ enterprise clients
- €1.5M ARR
- 99.9% uptime SLA
- Net Promoter Score > 50

---

> **Remember**: This tech stack is designed to scale from 0 to €10M ARR while keeping your stress levels low and your enterprise clients happy. Every decision prioritizes reliability and maintainability over bleeding-edge complexity.

**Build once. Scale forever. Sleep peacefully.** 😴💰
