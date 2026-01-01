<script lang="ts">
	import { page } from '$app/state';
	import { ADMIN_ITEMS } from '$lib/types/roles';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Users from '@lucide/svelte/icons/users';
	import FileText from '@lucide/svelte/icons/file-text';
	import Tag from '@lucide/svelte/icons/tag';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Settings from '@lucide/svelte/icons/settings';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import * as Sidebar from '$lib/components/ui/sidebar';

	// Component props
	let { ...restProps } = $props();

	const iconMap: Record<string, typeof LayoutDashboard> = {
		'layout-dashboard': LayoutDashboard,
		users: Users,
		'file-text': FileText,
		tag: Tag,
		'message-circle': MessageCircle,
		settings: Settings
	};

	const currentPath = $derived(page.url.pathname);
</script>

<Sidebar.Root
	collapsible="icon"
	{...restProps}
	class="border-r border-amber-500/20 bg-linear-to-b from-amber-500/5 to-transparent"
>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					size="lg"
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					{#snippet child({ props })}
						<a href="/admin" {...props}>
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500"
							>
								<LayoutDashboard class="size-4" />
							</div>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold text-amber-500">Admin Panel</span>
								<span class="truncate text-xs">BlogSpace</span>
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
				{#each ADMIN_ITEMS as item}
					{@const Icon = iconMap[item.icon] || LayoutDashboard}
					{@const isActive = currentPath === item.href}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton {isActive} tooltipContent={item.label}>
							{#snippet child({ props })}
								<a href={item.href} {...props}>
									<Icon class={isActive ? 'text-amber-500' : ''} />
									<span class={isActive ? 'text-amber-500' : ''}>{item.label}</span>
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
				<Sidebar.MenuButton tooltipContent="Back to Dashboard">
					{#snippet child({ props })}
						<a href="/dashboard" {...props}>
							<ArrowLeft />
							<span>Back to Dashboard</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
