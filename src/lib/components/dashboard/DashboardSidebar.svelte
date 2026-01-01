<script lang="ts">
	import { page } from '$app/state';
	import { DASHBOARD_ITEMS, hasRole, isAdmin, type Role } from '$lib/types/roles';
	import Home from '@lucide/svelte/icons/home';
	import FileText from '@lucide/svelte/icons/file-text';
	import Plus from '@lucide/svelte/icons/plus';
	import BarChart from '@lucide/svelte/icons/bar-chart-3';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Clock from '@lucide/svelte/icons/clock';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Settings from '@lucide/svelte/icons/settings';
	import Shield from '@lucide/svelte/icons/shield';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import * as Sidebar from '$lib/components/ui/sidebar';

	interface Props {
		userRole: string | null | undefined;
	}

	let { userRole, ...restProps }: Props = $props();

	const iconMap: Record<string, typeof Home> = {
		home: Home,
		'file-text': FileText,
		plus: Plus,
		'bar-chart': BarChart,
		bookmark: Bookmark,
		clock: Clock,
		'message-circle': MessageCircle,
		settings: Settings
	};

	// Filter items based on user role
	const visibleItems = $derived(
		DASHBOARD_ITEMS.filter((item) => {
			if (!item.roles) return true;
			return item.roles.some((role) => hasRole(userRole, role));
		})
	);

	const currentPath = $derived(page.url.pathname);
</script>

<Sidebar.Root collapsible="icon" {...restProps} class="border-r border-border/50 bg-card/30">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					size="lg"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					{#snippet child({ props })}
						<a href="/dashboard" {...props}>
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
							>
								<Sparkles class="size-4" />
							</div>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">BlogSpace</span>
								<span class="truncate text-xs">Dashboard</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.Menu>
				{#each visibleItems as item}
					{@const Icon = iconMap[item.icon] || Home}
					{@const isActive = currentPath === item.href}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton {isActive} tooltipContent={item.label}>
							{#snippet child({ props })}
								<a href={item.href} {...props}>
									<Icon class={isActive ? 'text-primary' : ''} />
									<span class={isActive ? 'text-primary' : ''}>{item.label}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton tooltipContent="Back to Home">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<ArrowLeft />
							<span>Back to Home</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
			{#if isAdmin(userRole)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						tooltipContent="Admin Panel"
						class="text-amber-500 hover:bg-amber-500/10 hover:text-amber-500"
					>
						{#snippet child({ props })}
							<a href="/admin" {...props}>
								<Shield />
								<span>Admin Panel</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/if}
		</Sidebar.Menu>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
