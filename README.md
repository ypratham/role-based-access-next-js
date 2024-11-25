
# AccessNexus 

A robust Role-Based Access Control (RBAC) dashboard built with the T3 Stack, featuring dynamic permission management, OAuth authentication, and optimized performance.

## 🌟 Features

### Dynamic Permission Management
- Create custom permissions with flexible source and action combinations
- Sources include USER, LOGS, ROLES, PERMISSIONS, etc.
- Actions include READ, WRITE, UPDATE, DELETE
- Define custom permission names and combinations

### Role Management
- Create roles by combining different permissions
- Dynamic role assignment and management
- Flexible role hierarchy support

### Activity Logging
- Comprehensive activity tracking system
- Logs user actions
- Records timestamp, user, action type, and affected resources
- Audit trail for security and compliance
- Searchable and filterable log history

### Security
- OAuth authentication integration
- Permission guard implementation for secure access control
- Protected routes and components
- Session management with Prisma acceleration

### User Management
- OAuth-based user authentication
- User activity status management (active/inactive)
- Secure user data handling

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **API**: [tRPC](https://trpc.io/)
- **Authentication**: [Auth.js](https://authjs.dev/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Table Management**: [React Table](https://tanstack.com/table/v8)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Stack**: [T3 Stack](https://create.t3.gg/)
- **Database** : [Suppabase](https://supabase.com/)

## 🛠️ Setup and Installation

### Prerequisites
```bash
Node.js >= 16.x
pnpm >= 8.x
PostgreSQL >= 14.x
```

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/rbac-dashboard.git
cd rbac-dashboard
```

2. Install dependencies
```bash
yarn 
```

3. Set up environment variables
```bash
cp .env.example .env
```

Configure the following variables in `.env`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rbac_db"
DIRECT_URL="transaction_pool_connection_url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="your-secret-key"

# OAuth Providers (Configure as needed)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

4. Set up the database
```bash
# Generate Prisma Client
yarn prisma generate

# Run migrations
yarn prisma migrate dev
```

5. Start the development server
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 📦 Production Build

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## 🔒 Permission Structure

### Sources
- USER: User management related permissions
- LOGS: System logs access
- ROLES: Role management
- PERMISSIONS: Permission management

### Actions
- READ: View access
- WRITE: Creation access
- UPDATE: Modification access
- DELETE: Deletion access

### Example Permission Combinations
```typescript
{
  name: "View Users",
  source: "USER",
  action: "READ"
}

{
  name: "Manage Roles",
  source: "ROLES",
  action: ["READ", "WRITE", "UPDATE", "DELETE"]
}
```


## 🛡️ Permission Guard Hook

The application implements permission checking through a custom React hook that provides flexible access control:

### Hook Features
- Type-safe permission checking
- Loading state handling

## 📊 Activity Logging System

The application includes a comprehensive activity logging system that tracks all important actions:

### Logged Activities
- User authentication events (login, logout)
- Permission changes
- Role modifications
- User status changes


## 🔄 Cache Implementation

The application implements caching at multiple levels:

- **Session Caching**: NextAuth session data cached with Prisma acceleration
- **API Response Caching**: Implemented for frequently accessed data
- **Database Query Caching**: Prisma query caching for optimized performance
