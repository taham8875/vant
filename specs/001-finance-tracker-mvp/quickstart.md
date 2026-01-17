# Quickstart Guide: Personal Finance Tracking SaaS - Core MVP

**Branch**: `001-finance-tracker-mvp` | **Date**: 2026-01-17

## Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 20+ (LTS)
- pnpm (recommended) or npm
- PostgreSQL 15+
- Redis 7+
- S3-compatible storage (or MinIO for local dev)

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone <repo-url> vant
cd vant

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Frontend setup
cd ../frontend
pnpm install
cp .env.example .env.local
```

### 2. Configure Environment

**Backend (.env)**:
```env
APP_NAME=Vant
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=vant
DB_USERNAME=postgres
DB_PASSWORD=secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@vant.local

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=vant-uploads
AWS_ENDPOINT=  # For MinIO: http://localhost:9000
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Create database
createdb vant

# Run migrations
cd backend
php artisan migrate

# Seed categories
php artisan db:seed --class=CategorySeeder
```

### 4. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
php artisan serve
```

**Terminal 2 - Queue Worker**:
```bash
cd backend
php artisan queue:work
```

**Terminal 3 - Frontend**:
```bash
cd frontend
pnpm dev
```

**Access Points**:
- Frontend: http://localhost:3000
- API: http://localhost:8000/api/v1
- API Docs: http://localhost:8000/api/documentation (if Swagger enabled)

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
php artisan test                    # All tests
php artisan test --filter=AuthTest  # Specific test
php artisan test --coverage         # With coverage

# Frontend tests
cd frontend
pnpm test                           # Unit tests
pnpm test:e2e                       # E2E tests (Playwright)
```

### Database Operations

```bash
# Create migration
php artisan make:migration create_transactions_table

# Fresh migrate (reset + migrate + seed)
php artisan migrate:fresh --seed

# Rollback last migration
php artisan migrate:rollback
```

### Code Quality

```bash
# Backend
cd backend
./vendor/bin/pint          # Laravel Pint (code style)
./vendor/bin/phpstan       # Static analysis

# Frontend
cd frontend
pnpm lint                  # ESLint
pnpm lint:fix              # Auto-fix
pnpm type-check            # TypeScript check
```

### API Development

```bash
# Generate API types from OpenAPI spec
cd frontend
pnpm generate:api-types

# Test API endpoint
curl -X GET http://localhost:8000/api/v1/auth/user \
  -H "Accept: application/json" \
  -b "laravel_session=<session_cookie>"
```

## Key Commands Reference

| Task | Command |
|------|---------|
| Start backend | `php artisan serve` |
| Start frontend | `pnpm dev` |
| Run queue | `php artisan queue:work` |
| Run all tests | `php artisan test && pnpm test` |
| Fresh DB | `php artisan migrate:fresh --seed` |
| Generate types | `pnpm generate:api-types` |
| Build frontend | `pnpm build` |

## Common Issues

### CORS Errors
Ensure `SANCTUM_STATEFUL_DOMAINS` includes your frontend URL and `SESSION_DOMAIN` is set correctly.

### Session Not Persisting
Check that the frontend is sending credentials: `fetch(url, { credentials: 'include' })`.

### Queue Jobs Not Processing
Ensure Redis is running and `QUEUE_CONNECTION=redis` in `.env`. Start worker with `php artisan queue:work`.

### CSV Import Fails
Check S3/MinIO credentials and that the bucket exists. For local dev, ensure MinIO is running.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐
│   Next.js SPA   │────▶│   Laravel API   │
│  (Port 3000)    │     │  (Port 8000)    │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              ┌─────▼─────┐ ┌────▼────┐ ┌────▼────┐
              │ PostgreSQL│ │  Redis  │ │   S3    │
              │  (5432)   │ │ (6379)  │ │ (9000)  │
              └───────────┘ └─────────┘ └─────────┘
```

## Next Steps

After setup is complete:

1. Run `/speckit.tasks` to generate implementation tasks
2. Start with P1 user stories (Auth, Transactions)
3. Use the OpenAPI spec for API development
4. Reference `data-model.md` for database schema
