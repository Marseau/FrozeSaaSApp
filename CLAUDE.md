# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FrozenSaaSApp is a multi-tenant delivery SaaS application with React+TypeScript frontend and Supabase backend. The project consists of:

- **Frontend**: React 18 + TypeScript + Vite + shadcn/ui + Tailwind CSS
- **Backend**: Supabase with complete multi-tenant schema
- **Database**: PostgreSQL with Row Level Security (RLS) policies
- **UI Components**: shadcn/ui components with Radix UI primitives

## Development Commands

### Frontend Development
```bash
cd frontend
npm install --legacy-peer-deps  # Install dependencies (resolves date-fns conflicts)
npm run dev                     # Start development server (localhost:5173)
npm run build                   # Build for production
npm run preview                 # Preview production build
npm run lint                    # Run ESLint
```

### Database Schema Management
```bash
# Apply base schema (MUST be done first)
psql -d database_name -f supabase_complete_schema.sql

# Apply corrections (only after base schema)
psql -d database_name -f supabase_schema_corrections.sql

# Alternative: Use Supabase Studio SQL Editor
```

## Architecture

### Multi-Tenant Structure
- **empresas** table serves as the main tenant identifier
- All business entities are linked to empresa_id for tenant isolation
- RLS policies enforce strict data separation between tenants
- **admins_plataforma** table manages super-admin access

### Application Structure (3 Levels)
1. **Platform Management** (`/admin`) - Super admin dashboard
2. **Company Management** (tenant admin) - Individual restaurant management
3. **Customer App** (end users) - Customer-facing ordering interface

### Key Database Tables
- `admins_plataforma`: Platform super-admins
- `empresas`: Tenant/company information with branding
- `usuarios`: Company staff and management
- `produtos`: Product catalog with inventory
- `pedidos`: Order management system
- `clientes_finais`: End customer accounts

### Frontend Structure
```
frontend/src/
├── integrations/supabase/      # Supabase client and auto-generated types
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── admin/                  # Platform admin components
│   └── auth/                   # Authentication components
├── pages/                      # Route components
├── contexts/                   # React contexts (AuthContext)
├── hooks/                      # Custom React hooks
└── lib/                        # Utilities and helpers
```

## Database Connection

- **Supabase URL**: `https://kuaxylxgyjygfmixkmhg.supabase.co`
- **Client Configuration**: `frontend/src/integrations/supabase/client.ts`
- **Types**: Auto-generated TypeScript types in `frontend/src/integrations/supabase/types.ts`

## Current Pages & Routes

- `/` - Landing page with pricing and features
- `/auth` - General authentication
- `/admin` - Platform admin login
- `/admin/dashboard` - Platform admin dashboard
- `/cliente` - Customer authentication
- `/cadastro-empresa` - Company registration

## Critical Schema Application Order

1. **ALWAYS** apply `supabase_complete_schema.sql` first
2. **THEN** apply `supabase_schema_corrections.sql`
3. **NEVER** apply corrections before base schema (causes relation errors)

## Commit Standards

Follow conventional commits:
- `feat:` - new functionality
- `fix:` - bug fixes
- `docs:` - documentation
- `style:` - formatting
- `refactor:` - refactoring
- `test:` - tests
- `chore:` - configuration

## Code Conventions

- Use TypeScript for all new code
- Follow existing patterns in integrations/supabase/ for database operations
- Use shadcn/ui components for consistent UI
- Implement proper error handling for Supabase operations
- Use Tailwind CSS for styling
- Follow the established file structure

## Development Workflow

1. Ensure Supabase schema is properly applied
2. Start frontend development server with `npm run dev`
3. Use auto-generated TypeScript types from supabase integration
4. Test database operations through Supabase client
5. Follow multi-tenant patterns (always filter by empresa_id or tenant context)

## Dependencies Notes

- Use `npm install --legacy-peer-deps` to resolve date-fns version conflicts
- Project uses shadcn/ui component library
- React Query for state management
- React Router for navigation