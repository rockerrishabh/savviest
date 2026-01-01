<script lang="ts">
	import type { PageData } from './$types';
	import { isAuthor } from '$lib/types/roles';
	import AuthorDashboard from '$lib/components/dashboard/AuthorDashboard.svelte';
	import UserDashboard from '$lib/components/dashboard/UserDashboard.svelte';

	let { data }: { data: PageData } = $props();

	// Get role from user session
	const userRole = $derived(data.user?.role);
	const userName = $derived(data.user?.name ?? 'User');
	const showAuthorDashboard = $derived(isAuthor(userRole));
</script>

<svelte:head>
	<title>Dashboard | BlogSpace</title>
	<meta
		name="description"
		content="Manage your blog posts, view analytics, and grow your audience on BlogSpace."
	/>
</svelte:head>

{#if showAuthorDashboard}
	<AuthorDashboard {userName} />
{:else}
	<UserDashboard {userName} />
{/if}
