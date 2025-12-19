# Community Connect - Community Discovery Platform

## Overview

Community Connect is a web-based platform designed to help users discover and connect with communities across India. The application enables users to explore communities by zone, state, city, and domain (Technology, Startup, Marketing, Design, etc.), while providing community organizers with tools to manage their communities and events. The platform features a modern, vibrant design inspired by Airbnb's discovery cards, Meetup's community profiles, and LinkedIn's professional trust signals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- React Query (TanStack Query) for server state management and data fetching

**UI Component System**
- Shadcn UI component library with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes
- Design philosophy emphasizing approachable, vibrant aesthetics celebrating India's diverse communities

**State Management**
- React Query for server state and caching
- React Context for theme management
- React Hook Form with Zod for form state and validation

**Key Design Decisions**
- Component-based architecture with reusable UI components (CommunityCard, EventCard, DomainCategory, etc.)
- Mobile-responsive design with custom breakpoint hooks
- Accessibility-first approach using Radix UI primitives
- Custom color palette with HSL-based theme tokens for consistent theming

### Backend Architecture

**Server Framework**
- Express.js running on Node.js
- TypeScript for type safety across the full stack
- ESM (ES Modules) format for modern JavaScript module system

**API Design**
- RESTful API structure with `/api` prefix for all routes
- Storage abstraction layer (IStorage interface) for database operations
- In-memory storage implementation (MemStorage) as default, designed to be swapped with database implementation

**Development Tools**
- Custom Vite middleware integration for HMR in development
- Request/response logging middleware for API monitoring
- Error handling middleware for consistent error responses

### Data Storage

**Schema Design (Drizzle ORM)**
- `communities` table: Stores community information including name, description, location (zone, city, pincode), domain, social links, verification status, and member count
- `community_members` table: Tracks community organizers and members with roles, contact information, and founder designation
- Type-safe schema definitions with Zod validation

**Database Strategy**
- Drizzle ORM configured for PostgreSQL dialect
- Prepared for Neon Database serverless PostgreSQL
- Schema-first approach with migrations directory
- Currently using in-memory storage with interface designed for easy database integration

**Data Validation**
- Zod schemas derived from Drizzle table definitions
- Insert schemas that omit auto-generated fields (id, timestamps)
- Type inference for full-stack type safety

### Authentication & Authorization

**Current State**
- No authentication system implemented yet
- Session management prepared (connect-pg-simple dependency present)
- Multiple dashboard types defined (User, Organizer, Admin) indicating planned role-based access control

**Planned Implementation**
- Session-based authentication using PostgreSQL session store
- Role-based access with three user types: regular users, community organizers, and administrators
- Protected routes for dashboard and administrative functions

### Routing & Navigation

**Client-Side Routing**
- Wouter for lightweight routing without React Router overhead
- Route structure:
  - Public routes: Home (`/`), Explore (`/explore`), Zones (`/zones`), Zone Detail (`/zone/:id`), Community Detail (`/community/:id`), About (`/about`)
  - Registration: Community Registration (`/register`)
  - Dashboards: User (`/dashboard`), Organizer (`/organizer/dashboard`), Admin (`/admin/dashboard`)

**Server-Side Rendering Approach**
- Vite middleware mode for development with HMR
- SPA architecture with client-side template rendering
- Static file serving for production builds

## External Dependencies

### Database & ORM
- **Drizzle ORM**: Type-safe ORM with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon Database
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation

### UI Component Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible component primitives (dialogs, dropdowns, navigation, forms, etc.)
- **Shadcn UI**: Pre-styled components built on Radix UI (via components.json configuration)
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command palette component for search and navigation

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **tailwind-merge**: Utility for merging Tailwind classes
- **clsx**: Conditional class name composition

### Form Management
- **React Hook Form**: Performant form state management
- **@hookform/resolvers**: Integration with validation libraries
- **Zod**: Schema validation for forms and data

### Data Fetching & State
- **@tanstack/react-query**: Server state management, caching, and synchronization
- **date-fns**: Date manipulation and formatting

### Development Tools
- **Vite**: Build tool and dev server
- **@replit/vite-plugin-runtime-error-modal**: Runtime error overlay for development
- **@replit/vite-plugin-cartographer**: Code navigation in Replit
- **@replit/vite-plugin-dev-banner**: Development environment banner

### Session Management (Prepared)
- **connect-pg-simple**: PostgreSQL session store for Express (ready for authentication implementation)

### Carousel/Slider
- **embla-carousel-react**: Carousel component for image galleries and content sliders

### Type Safety
- **TypeScript**: Full-stack type safety
- **@types/node**: Node.js type definitions