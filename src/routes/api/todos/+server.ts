// src/routes/api/todos/+server.ts
import { db } from "$lib/db";
import { todos } from "$lib/schema";
import { eq } from "drizzle-orm";
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const all = await db.select().from(todos);
        return new Response(JSON.stringify(all), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('GET /api/todos error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch todos' }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { title } = await request.json();
        if (!title) {
            return new Response(JSON.stringify({ error: 'title required' }), { 
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        // Remove .run() as it's not needed with Drizzle
        await db.insert(todos).values({ title });
        
        return new Response(JSON.stringify({ message: 'Created successfully' }), { 
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('POST /api/todos error:', error);
        return new Response(JSON.stringify({ error: 'Failed to create todo' }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

export const PUT: RequestHandler = async ({ request }) => {
    try {
        const { id, title, completed } = await request.json();
        if (!id) {
            return new Response(JSON.stringify({ error: 'id required' }), { 
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        // Remove .run() as it's not needed with Drizzle
        await db.update(todos).set({ title, completed }).where(eq(todos.id, Number(id)));
        
        return new Response(JSON.stringify({ message: 'Updated successfully' }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('PUT /api/todos error:', error);
        return new Response(JSON.stringify({ error: 'Failed to update todo' }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

export const DELETE: RequestHandler = async ({ url }) => {
    try {
        const id = Number(url.searchParams.get("id"));
        if (!id) {
            return new Response(JSON.stringify({ error: 'id required' }), { 
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        // Remove .run() as it's not needed with Drizzle
        await db.delete(todos).where(eq(todos.id, id));
        
        return new Response(JSON.stringify({ message: 'Deleted successfully' }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('DELETE /api/todos error:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete todo' }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};