# Turso + Vercel Database Setup Guide

This project is now configured to use Turso (a SQLite-compatible database) on Vercel.

## Local Development Setup

### Using Local SQLite (default)

By default, the app uses a local SQLite database (`inventory.db`). No additional setup is required.

To seed the local database:

```bash
npm run seed
```

### Using Turso Locally

If you want to test with Turso before deploying:

1. **Create a Turso database:**

   ```bash
   turso db create littlebar-inventory
   ```

2. **Get your credentials:**

   ```bash
   turso db show littlebar-inventory --http
   ```

3. **Update `.env.local`:**

   ```
   TURSO_CONNECTION_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-auth-token-here
   ```

4. **Seed the database:**

   ```bash
   npm run seed
   ```

5. **Start development:**
   ```bash
   npm run dev
   ```

## Vercel Deployment Setup

### Step 1: Create a Turso Database

Install Turso CLI:

```bash
brew install tursodatabase/tap/turso
# or visit https://docs.turso.tech/reference/turso-cli
```

Create a database:

```bash
turso auth signup
turso db create littlebar-inventory
```

### Step 2: Get Your Credentials

```bash
turso db show littlebar-inventory --http
```

You'll get:

- `TURSO_CONNECTION_URL`: The libsql connection URL
- `TURSO_AUTH_TOKEN`: Your authentication token

### Step 3: Add Vercel Environment Variables

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:
   - `TURSO_CONNECTION_URL`: `libsql://your-database.turso.io`
   - `TURSO_AUTH_TOKEN`: Your auth token

### Step 4: Deploy

```bash
vercel
```

### Step 5: Run Migrations (if needed)

After deployment, you can run Drizzle migrations:

```bash
# Generate migrations
npx drizzle-kit generate

# Push migrations to Turso (run this in Vercel)
# Or manually in the Vercel deployment logs
```

## File Changes Summary

- **`lib/db.ts`**: Updated to use `@libsql/client` instead of `better-sqlite3`
- **`lib/seed.ts`**: Refactored to work with async Turso client
- **`drizzle.config.ts`**: Updated to use Turso driver and environment variables
- **`package.json`**: Replaced `better-sqlite3` with `@libsql/client`

## Environment Variables

| Variable               | Description                | Example                   |
| ---------------------- | -------------------------- | ------------------------- |
| `TURSO_CONNECTION_URL` | Turso database URL         | `libsql://my-db.turso.io` |
| `TURSO_AUTH_TOKEN`     | Turso authentication token | Your token from dashboard |

**Note:** If these variables are not set, the app will fall back to local SQLite using `inventory.db`.

## Troubleshooting

### Database not found error

- Ensure `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are set correctly
- Check your Turso dashboard for the correct database URL

### Connection timeout

- Verify your auth token is valid
- Check your internet connection
- Ensure Turso database is not in read-only mode

### Seed script fails

- Make sure you've installed dependencies: `npm install`
- Verify environment variables are set correctly
- Check the database credentials are valid

## References

- [Turso Documentation](https://docs.turso.tech/)
- [Drizzle ORM with Turso](https://orm.drizzle.team/docs/get-started-sqlite)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
