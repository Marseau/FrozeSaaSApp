# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FrozenSaaSApp is a multi-tenant delivery SaaS application with React frontend and Supabase backend. The project consists of:

- **Frontend**: React 18 + TypeScript + Tailwind CSS using Vite
- **Backend**: Supabase with 30+ tables for multi-tenant delivery system
- **Database**: PostgreSQL with Row Level Security (RLS) policies
- **UI Components**: Radix UI primitives with custom styling

## Development Commands

### Frontend Development
```bash
cd frontend
npm install           # Install dependencies
npm run dev          # Start development server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
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
- All business entities (produtos, pedidos, usuarios) are linked to empresa_id
- RLS policies enforce tenant isolation

### Key Database Tables
- `empresas`: Tenant/company information with branding settings
- `produtos`: Product catalog with inventory management
- `pedidos`: Order system with status tracking
- `usuarios`: User management with role-based access
- `clientes_finais`: End customer management

### Frontend Structure
```
frontend/src/
├── lib/supabase.ts     # Supabase client configuration and types
├── hooks/              # Custom React hooks (e.g., useCEP.ts)
├── services/           # API service layer (e.g., cep.ts)
└── components/         # React components (to be developed)
```

## Database Connection

- **Supabase URL**: `https://kuaxylxgyjygfmixkmhg.supabase.co`
- **Client Configuration**: `frontend/src/lib/supabase.ts`
- **Types**: TypeScript database types are defined in supabase.ts

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
- Follow existing patterns in supabase.ts for database types
- Implement proper error handling for Supabase operations
- Use Tailwind CSS for styling
- Leverage Radix UI components for consistent UI

## Development Workflow

1. Ensure Supabase schema is properly applied
2. Start frontend development server
3. Use TypeScript types from supabase.ts
4. Test database operations through Supabase client
5. Follow multi-tenant patterns (always filter by empresa_id)