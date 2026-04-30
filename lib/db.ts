import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// For Vercel/Turso, use environment variables
// For local development, use file-based SQLite
const dbUrl = process.env.TURSO_CONNECTION_URL || 'file:inventory.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!process.env.TURSO_CONNECTION_URL && process.env.NODE_ENV === 'production') {
  console.warn(
    '⚠️ Warning: TURSO_CONNECTION_URL not set in production. Using local SQLite file.',
  );
}

const client = createClient({
  url: dbUrl,
  authToken: authToken,
});

export const db = drizzle({ client, schema });

export default db;
