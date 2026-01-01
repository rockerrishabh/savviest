<script lang="ts">
	import { page } from '$app/state';
	import Bell from '@lucide/svelte/icons/bell';
	import Search from '@lucide/svelte/icons/search';
	import { Button } from '$lib/components/ui/button';
	import { SidebarTrigger } from '$lib/components/ui/sidebar';
	import { Separator } from '$lib/components/ui/separator';

	// Get current page title from path
	const getPageTitle = (pathname: string) => {
		const segments = pathname.split('/').filter(Boolean);
		if (segments.length <= 1) return 'Overview';
		const lastSegment = segments[segments.length - 1];
		return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
	};

	const pageTitle = $derived(getPageTitle(page.url.pathname));
	const breadcrumbs = $derived(
		page.url.pathname
			.split('/')
			.filter(Boolean)
			.map((segment, i, arr) => ({
				label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
				href: '/' + arr.slice(0, i + 1).join('/'),
				isLast: i === arr.length - 1
			}))
	);
</script>

<header
	class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl sm:px-6"
>
	<!-- Left side - Breadcrumbs -->
	<div class="flex items-center gap-2">
		<SidebarTrigger />
		<Separator orientation="vertical" class="mr-2 h-4" />
		<nav class="flex items-center gap-1 text-sm">
			{#each breadcrumbs as crumb, i}
				{#if i > 0}
					<span class="text-muted-foreground">/</span>
				{/if}
				{#if crumb.isLast}
					<span class="font-medium text-foreground">{crumb.label}</span>
				{:else}
					<a
						href={crumb.href}
						class="text-muted-foreground transition-colors hover:text-foreground"
					>
						{crumb.label}
					</a>
				{/if}
			{/each}
		</nav>
	</div>

	<!-- Right side - Search & Notifications -->
	<div class="flex items-center gap-3">
		<!-- Search -->
		<div class="relative hidden sm:block">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<input
				type="search"
				placeholder="Search..."
				class="h-9 w-48 rounded-lg border border-border/50 bg-muted/30 py-2 pr-4 pl-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary lg:w-64"
			/>
		</div>

		<!-- Mobile Search Button -->
		<Button variant="ghost" size="icon" class="sm:hidden">
			<Search class="h-5 w-5" />
		</Button>

		<!-- Notifications -->
		<Button variant="ghost" size="icon" class="relative">
			<Bell class="h-5 w-5" />
			<span
				class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"
			></span>
		</Button>
	</div>
</header>
