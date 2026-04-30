# PostgreSQL/Neon Setup Guide for Vercel

Your project has been converted from SQLite/Turso to PostgreSQL/Neon. This guide walks you through the final setup steps.

## Quick Start

### 1. Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up or log in with GitHub
3. Click **New Project**
4. Select your region (closest to your users)
5. Create the project
6. Go to **Connection String** and copy the `POSTGRES_PRISMA_URL`

### 2. Update `.env.local` (Local Development)

Replace the placeholder in `.env.local` with your actual connection string:

```bash
POSTGRES_PRISMA_URL=postgresql://[username]:[password]@[host]/[database]?sslmode=require
```

**Where to find these:**

- From Neon Console: **Connection String** → Select **Prisma** from the dropdown
- Copy the entire URL

### 3. Create Tables Locally

Before running migrations on Vercel, create the tables locally:

```bash
npx drizzle-kit generate  # Generate migration files
npx drizzle-kit push     # Push migrations to your Neon database
```

Or run the seed script:

```bash
npm run seed
```

### 4. Verify Connection

Test your connection by running:

```bash
npm run dev
```

Visit http://localhost:3000/api/inventory to verify the API works.

## Deploying to Vercel

### Step 1: Add Environment Variable to Vercel

1. Go to your **Vercel Project** → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `POSTGRES_PRISMA_URL`
   - **Value:** Your full Neon connection string from step 1
3. Click **Save**

### Step 2: Deploy

```bash
git add -A
git commit -m "Convert to PostgreSQL/Neon"
git push
```

Vercel will automatically deploy with your environment variables.

### Step 3: Seed Production Database (if needed)

After deployment, if your tables aren't created automatically:

1. Get the connection string from your deployed Neon project
2. Temporarily add it to `.env.local`
3. Run: `npm run seed`

Or add this to your Vercel deployment script in `package.json` to auto-seed:

```json
"scripts": {
  "build": "next build && npm run seed-if-needed",
  "seed-if-needed": "node scripts/seed-if-empty.js"
}
```

## Files Changed

| File                | Changes                                           |
| ------------------- | ------------------------------------------------- |
| `package.json`      | Replaced `@libsql/client` with `@vercel/postgres` |
| `lib/schema.ts`     | Changed from `sqliteTable` to `pgTable`           |
| `lib/db.ts`         | Using `@vercel/postgres` SQL client               |
| `drizzle.config.ts` | Updated to PostgreSQL dialect                     |
| `lib/seed.ts`       | Refactored for PostgreSQL                         |
| `.env.local`        | Updated for Neon connection string                |

## Troubleshooting

### "Failed to load inventory"

- Verify `POSTGRES_PRISMA_URL` is set in `.env.local`
- Check connection string is correct (test with `psql` if you have it)
- Ensure tables exist: `npm run seed`

### "Too many connections"

- Neon free tier has limited connections
- Upgrade plan or close unused connections

### Authentication Failed

- Copy the FULL connection string from Neon (including `?sslmode=require`)
- Don't share credentials publicly

### Migrations Not Running

```bash
npx drizzle-kit generate    # Creates migration files
npx drizzle-kit push        # Applies to database
```

## Local PostgreSQL Alternative

If you prefer running PostgreSQL locally instead of Neon:

```bash
# Install PostgreSQL locally
# Create a database named "inventory"
# Update .env.local with local connection string

POSTGRES_PRISMA_URL=postgresql://localhost/inventory
```

Then run migrations:

```bash
npx drizzle-kit push
npm run seed
```

## Key Differences: SQLite → PostgreSQL

- **Serial IDs:** Changed from `integer().primaryKey()` to `serial().primaryKey()`
- **Text storage:** Some fields remain TEXT (works fine in PostgreSQL)
- **Queries:** Most queries remain the same (ORM handles differences)
- **Connection pooling:** Vercel Postgres handles this automatically

## Helpful Links

- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM PostgreSQL Guide](https://orm.drizzle.team/docs/get-started-postgresql)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Note:** @vercel/postgres is deprecated but still functional. For new projects, consider using Neon's native SDK directly, but this setup works great for existing applications.
