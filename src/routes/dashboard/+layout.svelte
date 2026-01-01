<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<svelte:head>
	<title>Dashboard | BlogSpace</title>
</svelte:head>

<div class="flex-1 p-6">
	{@render children()}
</div>
