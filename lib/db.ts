import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// For Vercel/Turso, use environment variables
// For local development, use file-based SQLite
const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || 'file:inventory.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle({ client, schema });

export default db;
