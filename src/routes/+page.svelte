<script lang="ts">
	import { onMount } from 'svelte';
	let todos: any[] = [];
	let newTitle = '';
	let loading = false;
	let error = '';

	async function loadTodos() {
		try {
			loading = true;
			error = '';
			console.log('Loading todos...');

			const res = await fetch('/api/todos');
			console.log('Response status:', res.status);

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Error response:', errorText);
				throw new Error(`HTTP ${res.status}: ${errorText}`);
			}

			todos = await res.json();
			console.log('Loaded todos:', todos);
		} catch (err) {
			console.error('Failed to load todos:', err);
			error = `Failed to load todos: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			loading = false;
		}
	}

	async function addTodo() {
		if (!newTitle.trim()) return;

		try {
			loading = true;
			error = '';
			console.log('Adding todo:', newTitle);

			const res = await fetch('/api/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: newTitle.trim() })
			});

			console.log('Add response status:', res.status);

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Add error response:', errorText);
				throw new Error(`HTTP ${res.status}: ${errorText}`);
			}

			newTitle = '';
			await loadTodos();
		} catch (err) {
			console.error('Failed to add todo:', err);
			error = `Failed to add todo: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			loading = false;
		}
	}

	async function deleteTodo(id: number) {
		try {
			loading = true;
			error = '';
			console.log('Deleting todo:', id);

			const res = await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
			console.log('Delete response status:', res.status);

			if (!res.ok) {
				const errorText = await res.text();
				console.error('Delete error response:', errorText);
				throw new Error(`HTTP ${res.status}: ${errorText}`);
			}

			await loadTodos();
		} catch (err) {
			console.error('Failed to delete todo:', err);
			error = `Failed to delete todo: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			loading = false;
		}
	}

	onMount(loadTodos);
</script>

<main class="mx-auto max-w-xl p-6">
	<h1 class="mb-4 text-2xl font-bold">Todos</h1>

	{#if error}
		<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			{error}
		</div>
	{/if}

	<div class="mb-4 flex gap-2">
		<input
			bind:value={newTitle}
			placeholder="New todo"
			disabled={loading}
			class="flex-1 rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
		<button
			on:click={addTodo}
			disabled={loading || !newTitle.trim()}
			class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
		>
			{loading ? 'Loading...' : 'Add'}
		</button>
	</div>

	{#if loading && todos.length === 0}
		<div class="py-4 text-center">Loading todos...</div>
	{:else if todos.length === 0}
		<div class="py-4 text-center text-gray-500">No todos yet. Add your first todo!</div>
	{:else}
		<ul class="space-y-2">
			{#each todos as todo}
				<li class="flex items-center justify-between border-b border-gray-200 p-3">
					<span>{todo.title}</span>
					<button
						on:click={() => deleteTodo(todo.id)}
						disabled={loading}
						class="px-3 py-1 text-red-600 hover:text-red-800 disabled:text-gray-400"
					>
						Delete
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</main>
