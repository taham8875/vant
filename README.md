# Vant Finance

Personal finance tracking application.

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

Backend setup coming soon.

## Development

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

