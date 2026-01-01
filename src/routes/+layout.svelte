<script lang="ts">
	import { SidebarProvider, SidebarInset } from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import Header from '$lib/components/Header.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();
</script>

<ModeWatcher />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Toaster />

<SidebarProvider>
	<AppSidebar user={data.user} />
	<SidebarInset>
		<Header />
		{@render children()}
	</SidebarInset>
</SidebarProvider>
