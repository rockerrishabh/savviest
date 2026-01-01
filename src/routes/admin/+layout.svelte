<script lang="ts">
	import type { LayoutData } from './$types';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children }: { data: LayoutData; children: any } = $props();
</script>

<svelte:head>
	<title>Admin Panel | BlogSpace</title>
</svelte:head>

<div class="flex-1 p-6">
	{@render children()}
</div>

<Toaster />
