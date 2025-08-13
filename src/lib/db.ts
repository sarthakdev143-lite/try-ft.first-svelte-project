// src/lib/db.ts
// Use static private env vars so values are embedded at build time
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';
import { createClient } from '@libsql/client';

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
	throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in environment variables');
}

export const db = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN
});
