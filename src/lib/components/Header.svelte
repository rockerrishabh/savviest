<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Home from '@lucide/svelte/icons/home';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import Settings from '@lucide/svelte/icons/settings';
	import LogOut from '@lucide/svelte/icons/log-out';
	import UserIcon from '@lucide/svelte/icons/user';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Shield from '@lucide/svelte/icons/shield';
	import Bell from '@lucide/svelte/icons/bell';
	import Search from '@lucide/svelte/icons/search';
	import { SidebarTrigger } from '$lib/components/ui/sidebar';
	import { isAdmin } from '$lib/types/roles';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	// Use server-side user data from page store (no loading delay)
	let user = $derived(page.data.user);

	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ label: 'Home', href: '/', icon: Home },
		{ label: 'Dashboard', href: '/dashboard', icon: BarChart3, auth: true }
	];

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onError: () => {
					toast.error('Failed to sign out');
				},
				onSuccess: async () => {
					toast.success('You have been signed out');
					await invalidateAll();
					goto('/auth/sign-in');
				}
			}
		});
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	// Dashboard-specific logic
	const isDashboardPaths = $derived(
		page.url.pathname.startsWith('/dashboard') || page.url.pathname.startsWith('/admin')
	);

	const breadcrumbs = $derived([
		{ label: 'Home', href: '/', isLast: false },
		...page.url.pathname
			.split('/')
			.filter(Boolean)
			.map((segment, i, arr) => ({
				label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
				href: '/' + arr.slice(0, i + 1).join('/'),
				isLast: i === arr.length - 1
			}))
	]);
</script>

<header class="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
	<div class="w-full px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Left side -->
			<div class="flex items-center gap-2 px-4">
				{#if isDashboardPaths}
					<SidebarTrigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<Breadcrumb.Root class="hidden items-center sm:flex">
						<Breadcrumb.List>
							{#each breadcrumbs as crumb, i}
								<Breadcrumb.Item>
									{#if crumb.isLast}
										<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
									{:else}
										<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
									{/if}
								</Breadcrumb.Item>
								{#if !crumb.isLast}
									<Breadcrumb.Separator />
								{/if}
							{/each}
						</Breadcrumb.List>
					</Breadcrumb.Root>
				{:else}
					<!-- Logo -->
					<a href="/" class="flex items-center gap-2 transition-opacity hover:opacity-80">
						<div
							class="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-chart-2 shadow-lg shadow-primary/20"
						>
							<Sparkles class="h-5 w-5 text-primary-foreground" />
						</div>
						<span class="text-xl font-bold text-foreground">BlogSpace</span>
					</a>

					<!-- Desktop Navigation -->
					<nav class="ml-8 hidden items-center gap-1 md:flex">
						{#each navLinks as link}
							{#if !link.auth || user}
								<a
									href={link.href}
									class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
								>
									<link.icon class="h-4 w-4" />
									{link.label}
								</a>
							{/if}
						{/each}
					</nav>
				{/if}
			</div>

			<!-- Right side -->
			<div class="flex items-center gap-3">
				<!-- Search (More prominent on dashboard, or always available) -->
				<div class="relative hidden sm:block">
					<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						type="search"
						placeholder="Search..."
						class="h-9 w-48 rounded-lg border border-border/50 bg-muted/30 py-2 pr-4 pl-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary lg:w-64"
					/>
				</div>
				<Button variant="ghost" size="icon" class="sm:hidden">
					<Search class="h-5 w-5" />
				</Button>

				{#if user}
					<!-- Notifications -->
					<Button variant="ghost" size="icon" class="relative">
						<Bell class="h-5 w-5" />
						<span
							class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"
						></span>
					</Button>
				{/if}

				<ThemeToggle />

				{#if user}
					<!-- User Menu -->
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<button
									{...props}
									class="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:outline-none"
								>
									<Avatar.Root class="h-8 w-8">
										{#if user.image}
											<Avatar.Image src={user.image} alt={user.name} />
										{/if}
										<Avatar.Fallback
											class="bg-linear-to-br from-primary to-chart-2 text-xs font-medium text-primary-foreground"
										>
											{getInitials(user.name)}
										</Avatar.Fallback>
									</Avatar.Root>
									<ChevronDown class="hidden h-4 w-4 text-muted-foreground sm:block" />
								</button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="w-56">
							<div class="px-2 py-1.5">
								<p class="text-sm font-medium text-foreground">{user.name}</p>
								<p class="text-xs text-muted-foreground">{user.email}</p>
							</div>
							<DropdownMenu.Separator />
							{#if isAdmin(user?.role)}
								<DropdownMenu.Item>
									<a href="/admin" class="flex items-center gap-2 text-amber-500">
										<Shield class="mr-2 h-4 w-4" />
										<span>Admin Panel</span>
									</a>
								</DropdownMenu.Item>
							{/if}
							<DropdownMenu.Item>
								<a href="/dashboard" class="flex items-center gap-2 text-primary">
									<BarChart3 class="mr-2 h-4 w-4" />
									<span>Dashboard</span>
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a href="/profile" class="flex items-center gap-2 text-primary">
									<UserIcon class="mr-2 h-4 w-4" />
									<span>Profile</span>
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a href="/settings" class="flex items-center gap-2 text-primary">
									<Settings class="mr-2 h-4 w-4" />
									<span>Settings</span>
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item class="text-destructive">
								<button onclick={handleSignOut} class="flex items-center gap-2">
									<LogOut class="mr-2 h-4 w-4" />
									<span>Sign out</span>
								</button>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<!-- Auth buttons -->
					<div class="hidden items-center gap-2 sm:flex">
						<Button variant="ghost" href="/auth/sign-in">Sign in</Button>
						<Button href="/auth/sign-up">Get Started</Button>
					</div>
				{/if}

				{#if !isDashboardPaths}
					<!-- Mobile menu button -->
					<Button
						variant="ghost"
						size="icon"
						class="md:hidden"
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{#if mobileMenuOpen}
							<X class="h-5 w-5" />
						{:else}
							<Menu class="h-5 w-5" />
						{/if}
					</Button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Mobile menu (Only for main site navigation) -->
	{#if mobileMenuOpen && !isDashboardPaths}
		<div class="border-t border-border/50 bg-background md:hidden">
			<div class="space-y-1 px-4 py-4">
				{#each navLinks as link}
					{#if !link.auth || user}
						<a
							href={link.href}
							class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
							onclick={() => (mobileMenuOpen = false)}
						>
							<link.icon class="h-5 w-5" />
							{link.label}
						</a>
					{/if}
				{/each}

				{#if !user}
					<Separator class="my-3" />
					<div class="flex flex-col gap-2">
						<Button variant="outline" href="/auth/sign-in" class="w-full">Sign in</Button>
						<Button href="/auth/sign-up" class="w-full">Get Started</Button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</header>
