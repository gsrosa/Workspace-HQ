# WorkspaceHQ

Modern workspace management platform built with Next.js, tRPC, Prisma, and Radix UI.

## Tech Stack

- **Next.js 14+** (App Router) - Server components, streaming SSR, Suspense boundaries
- **TypeScript** - Type safety across full stack
- **tRPC** - End-to-end type safety
- **Prisma + Postgres** - Type-safe ORM
- **Auth.js (NextAuth)** - Credentials provider
- **TanStack Query** - Client state, optimistic updates
- **Zustand** - Global UI state
- **Radix UI** - Accessible component primitives
- **TanStack Virtual** - 50k+ row virtualization
- **Storybook + Chromatic** - Component documentation and visual testing
- **Vitest** - Fast unit tests
- **Playwright** - E2E testing
- **Tailwind CSS** - Dark theme with custom tokens

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and secrets

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database (optional)
pnpm prisma db seed

# Start development server
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run E2E tests
- `pnpm storybook` - Start Storybook
- `pnpm storybook:build` - Build Storybook for production

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Shared UI components
├── features/         # Feature-based modules
│   ├── auth/
│   ├── orgs/
│   ├── tasks/
│   └── dashboard/
├── lib/              # Core utilities (prisma, trpc, auth)
├── server/           # tRPC routers and middlewares
├── stores/           # Zustand stores
└── styles/           # Global styles
```

## Features

- ✅ Authentication (credentials)
- ✅ Organization management
- ✅ RBAC (Role-Based Access Control)
- ✅ Task CRUD with virtualization
- ✅ Dashboard with SSR
- ✅ Rate limiting

## License

MIT
