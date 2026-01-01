<script lang="ts">
	import { page } from '$app/state';
	import DashboardSidebar from './dashboard/DashboardSidebar.svelte';
	import AdminSidebar from './admin/AdminSidebar.svelte';

	interface Props {
		user: any;
	}

	let { user } = $props();

	const isDashboard = $derived(page.url.pathname.startsWith('/dashboard'));
	const isAdminPath = $derived(page.url.pathname.startsWith('/admin'));
</script>

{#if isAdminPath}
	<AdminSidebar />
{:else if isDashboard}
	<DashboardSidebar userRole={user?.role} />
{/if}
