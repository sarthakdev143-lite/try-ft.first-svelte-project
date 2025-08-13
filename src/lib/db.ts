// src/lib/db.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const url = import.meta.env.VITE_TURSO_DATABASE_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url) throw new Error("TURSO_DATABASE_URL is missing");
if (!authToken) throw new Error("TURSO_AUTH_TOKEN is missing");

const client = createClient({ url, authToken });
export const db = drizzle(client);
