// src/routes/api/todos/+server.ts
import { db } from "$lib/db";
import { todos } from "$lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const all = await db.select().from(todos);
    return new Response(JSON.stringify(all), { status: 200 });
}

export async function POST({ request }) {
    const { title } = await request.json();
    if (!title) return new Response("title required", { status: 400 });
    await db.insert(todos).values({ title }).run();
    return new Response("OK", { status: 201 });
}

export async function PUT({ request }) {
    const { id, title, completed } = await request.json();
    if (!id) return new Response("id required", { status: 400 });
    await db.update(todos).set({ title, completed }).where(eq(todos.id, Number(id))).run();
    return new Response("Updated", { status: 200 });
}

export async function DELETE({ url }) {
    const id = Number(url.searchParams.get("id"));
    if (!id) return new Response("id required", { status: 400 });
    await db.delete(todos).where(eq(todos.id, id)).run();
    return new Response("Deleted", { status: 200 });
}
