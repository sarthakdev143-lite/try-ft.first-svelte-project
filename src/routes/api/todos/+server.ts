import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import type { InArgs } from '@libsql/client';

export async function GET() {
	try {
		const result = await getTodos();
		return json(result);
	} catch (err) {
		console.error('Database query failed:', err);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

async function getTodos() {
	const result = await db.execute('SELECT * FROM todos');
	return result.rows;
}

export async function POST({ request }) {
	const data = await request.json();
	try {
		await addTodo(data);
		return json({ message: 'Todo created successfully' });
	} catch (err) {
		console.error('Failed to create todo:', err);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

async function addTodo(data: { title: InArgs | undefined; }) {
	const result = await db.execute('INSERT INTO todos (title) VALUES (?)', data.title);
	return result;
}
