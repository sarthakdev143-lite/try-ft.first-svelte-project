// src/lib/db.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';

// Use server-side environment variables
const url = TURSO_DATABASE_URL;
const authToken = TURSO_AUTH_TOKEN;

if (!url) {
    console.error("TURSO_DATABASE_URL is missing");
    throw new Error("TURSO_DATABASE_URL is missing");
}

if (!authToken) {
    console.error("TURSO_AUTH_TOKEN is missing");
    throw new Error("TURSO_AUTH_TOKEN is missing");
}

const client = createClient({ url, authToken });
export const db = drizzle(client);