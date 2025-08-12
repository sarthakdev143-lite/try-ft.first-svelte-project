<script lang="ts">
	import { onMount } from 'svelte';
	let todos: any[] = [];
	let newTitle = '';

	async function loadTodos() {
		const res = await fetch('/api/todos');
		todos = await res.json();
	}

	async function addTodo() {
		if (!newTitle) return;
		await fetch('/api/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: newTitle })
		});
		newTitle = '';
		await loadTodos();
	}

	async function del(id: number) {
		await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
		await loadTodos();
	}

	onMount(loadTodos);
</script>

<main class="mx-auto max-w-xl p-6">
	<h1>Todos</h1>

	<div style="display:flex; gap:8px; margin-bottom:12px">
		<input
			bind:value={newTitle}
			placeholder="New todo"
			style="flex:1;padding:8px;border:1px solid #ccc"
		/>
		<button on:click={addTodo} style="padding:8px 12px">Add</button>
	</div>

	<ul>
		{#each todos as t}
			<li
				style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee"
			>
				<span>{t.title}</span>
				<button on:click={() => del(t.id)} style="color:#b00">Delete</button>
			</li>
		{/each}
	</ul>
</main>
