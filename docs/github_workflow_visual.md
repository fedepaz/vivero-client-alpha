# GitHub Actions Workflow Structure for Solo Developer

## Visual Workflow Structure

### Lint & Test Workflow (On PR/Push)
```
┌─────────────────────────────────────────────────────────────┐
│                    Lint & Test Pipeline                     │
├─────────────────────────────────────────────────────────────┤
│ Trigger: PR to main/dev OR Push to dev                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Install Deps    │    │ Install Deps    │                │
│  │ (Frontend)      │    │ (Backend)       │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Matrix Strategy │    │ Matrix Strategy │                │
│  │ ├─ Lint         │    │ ├─ Lint         │                │
│  │ ├─ Type Check   │    │ ├─ Type Check   │                │
│  │ └─ Unit Tests   │    │ └─ Unit Tests   │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           └───────┬───────────────┘                        │
│                   │                                        │
│            ┌─────────────┐                                 │
│            │   Report    │                                 │
│            │  Coverage   │                                 │
│            └─────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

### Deploy Workflow (On Merge to Main)
```
┌─────────────────────────────────────────────────────────────┐
│                  Deployment Pipeline                        │
├─────────────────────────────────────────────────────────────┤
│ Trigger: Merge to main (after lint/test passes)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Build Frontend  │    │ Build Backend   │                │
│  │ (Next.js)       │    │ (NestJS)        │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Deploy Vercel   │    │ Deploy Render   │                │
│  │ (if frontend    │    │ (if backend     │                │
│  │  changed)       │    │  changed)       │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           └───────┬───────────────┘                        │
│                   │                                        │
│            ┌─────────────┐                                 │
│            │   Smoke     │                                 │
│            │   Tests     │                                 │
│            └─────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

## Actual GitHub Workflows

### 1. Lint & Test Workflow
```yaml
# .github/workflows/test.yml
name: Test & Lint

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      frontend: ${{ steps.changes.outputs.frontend }}
      backend: ${{ steps.changes.outputs.backend }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            frontend:
              - 'frontend/**'
              - 'package.json'
            backend:
              - 'backend/**'
              - 'package.json'

  frontend-tests:
    needs: changes
    if: ${{ needs.changes.outputs.frontend == 'true' }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        task: [lint, type-check, test]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.15.0
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run ${{ matrix.task }}
        run: |
          case "${{ matrix.task }}" in
            lint) pnpm lint --workspace=frontend ;;
            type-check) pnpm type-check --workspace=frontend ;;
            test) pnpm test:coverage --workspace=frontend ;;
          esac
          
      - name: Upload coverage (test only)
        if: matrix.task == 'test'
        uses: codecov/codecov-action@v3

  backend-tests:
    needs: changes
    if: ${{ needs.changes.outputs.backend == 'true' }}
    runs-on: ubuntu-latest
    strategy:
      matrix:
        task: [lint, type-check, test]
    
    services:
      mariadb:
        image: mariadb:10.9
        env:
          MYSQL_ROOT_PASSWORD: test
          MYSQL_DATABASE: test
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
        
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.15.0
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run ${{ matrix.task }}
        run: |
          case "${{ matrix.task }}" in
            lint) pnpm lint --workspace=backend ;;
            type-check) pnpm type-check --workspace=backend ;;
            test) pnpm test:coverage --workspace=backend ;;
          esac
        env:
          DATABASE_URL: mysql://root:test@localhost:3306/test
```

### 2. Deploy Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      frontend: ${{ steps.changes.outputs.frontend }}
      backend: ${{ steps.changes.outputs.backend }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            frontend:
              - 'frontend/**'
            backend:
              - 'backend/**'

  deploy-frontend:
    needs: changes
    if: ${{ needs.changes.outputs.frontend == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    needs: changes
    if: ${{ needs.changes.outputs.backend == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  smoke-tests:
    needs: [deploy-frontend, deploy-backend]
    if: always() && (needs.deploy-frontend.result == 'success' || needs.deploy-backend.result == 'success')
    runs-on: ubuntu-latest
    steps:
      - name: Frontend health check
        if: needs.deploy-frontend.result == 'success'
        run: curl -f https://your-app.vercel.app/api/health
        
      - name: Backend health check  
        if: needs.deploy-backend.result == 'success'
        run: curl -f https://your-backend.onrender.com/health
```

## Deployment Platform Recommendations

For your solo developer setup with the roadmap you showed:

### Frontend: Vercel ✅
**Why it's perfect for you:**
- **Free tier**: Generous limits for development
- **Next.js optimization**: Built specifically for Next.js
- **Automatic deployments**: Connects directly to GitHub
- **Preview deployments**: Every PR gets a preview URL
- **Global CDN**: Fast loading worldwide
- **Custom domains**: Easy to add when ready to pay

**Pricing progression:**
- **Hobby (Free)**: Perfect for development and early trials
- **Pro ($20/month)**: When you need custom domains and more bandwidth
- **Enterprise**: When you have paying customers

### Backend: Render ✅ (Better than Railway/Heroku alternatives)
**Why Render over others:**
- **Better free tier** than Heroku (which discontinued free)
- **Persistent disk storage** for your MariaDB
- **Auto-deploy from GitHub**
- **Built-in SSL certificates**
- **Environment management**
- **Docker support** for your NestJS app

**Alternative considerations:**
- **Railway**: Good but more expensive quickly
- **Fly.io**: Great but steeper learning curve
- **DigitalOcean App Platform**: Solid but less generous free tier

### Database: PlanetScale or Render Postgres
**For development:**
- **PlanetScale (MySQL)**: Generous free tier, serverless scaling
- **Render Postgres**: Integrated with your backend hosting

**For production:**
- **PlanetScale**: Scales automatically, no maintenance
- **AWS RDS**: When you need full control (later phases)

## Selective Deployment Strategy

The workflows I showed use `paths-filter` to detect changes:

```yaml
# Only deploy frontend if frontend/ changes
if: ${{ needs.changes.outputs.frontend == 'true' }}

# Only deploy backend if backend/ changes  
if: ${{ needs.changes.outputs.backend == 'true' }}
```

This means:
- **Change only frontend code** → Only Vercel redeploys
- **Change only backend code** → Only Render redeploys
- **Change both** → Both redeploy
- **Change only docs/README** → Nothing redeploys

## Cost Progression for Your 6-Month Plan

### Phase 1-2 (Months 1-2): **$0/month**
- Vercel Hobby (Free)
- Render Free tier
- PlanetScale Free tier
- GitHub Actions (generous free tier)

### Phase 3-4 (Months 3-4): **~$30/month**
- Vercel Pro ($20) - for custom domain
- Render Starter ($7) - for always-on backend
- PlanetScale Scaler ($29) - when you exceed free limits

### Phase 5+ (Month 6+): **~$100-200/month**
- Vercel Pro ($20)
- Render Professional ($85) - for production reliability
- PlanetScale Scaler ($29)
- Additional services (monitoring, email)

This aligns perfectly with your roadmap - you stay free during development and only pay when you're close to getting your first €50k customer.

The selective deployment approach saves you both time and money by only deploying what actually changed.