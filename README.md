<div align="center">
  <img src="https://raw.githubusercontent.com/taham8875/vant/main/frontend/public/icon.svg" alt="Vant Finance Logo" width="80" height="80">
  <h1>Vant Finance</h1>
  <p>Personal finance tracking application</p>
</div>

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript 5
- React 18
- TanStack Query (data fetching & caching)
- Tailwind CSS
- Shadcn/ui components
- Zod validation

**Backend:**
- Laravel 11
- PHP 8.3
- PostgreSQL
- Laravel Sanctum (authentication)

## Features

- Email/password authentication
- Social OAuth (Google, GitHub)
- Password reset flow
- Email verification
- Dark/light mode
- Responsive design

## Setup

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Update NEXT_PUBLIC_API_URL in .env
npm run dev
```

Access at http://localhost:3000

### Backend

#### Prerequisites

**Option 1: Install Docker (Ubuntu 24.04)**

```bash
bash install-docker.sh
```

After installation, log out and log back in for group changes to take effect.

**Option 2: Manual Docker Installation**

Follow the [official Docker installation guide](https://docs.docker.com/engine/install/) for your platform.

#### Setup

1. **Start Docker services** (PostgreSQL, Redis, MinIO)

```bash
docker compose up -d
```

This will start:
- PostgreSQL 15 on port `5433`
- Redis 7 on port `6380`
- MinIO (S3-compatible storage) on ports `9000` (API) and `9001` (Console)

2. **Configure Laravel**

```bash
cd backend
composer install
cp .env.example .env
# Update database credentials in .env:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5433
# DB_DATABASE=vant
# DB_USERNAME=postgres
# DB_PASSWORD=secret
php artisan key:generate
php artisan migrate
```

3. **Start development server**

```bash
php artisan serve
```

Access at http://localhost:8000

**Stop services:**

```bash
docker compose down
```

## Development

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

