<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
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
	import { isAdmin } from '$lib/types/roles';

	// Use server-side user data from page store
	let user = $derived(page.data.user);

	const navLinks = [
		{ label: 'Home', href: '/', icon: Home },
		{ label: 'Dashboard', href: '/dashboard', icon: BarChart3, auth: true }
	];

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
					<!-- Breadcrumbs -->
					<div class="ml-2 hidden items-center gap-2 sm:flex">
						<div class="flex items-center text-sm text-muted-foreground">
							{#each breadcrumbs as crumb, i}
								{#if i > 0}
									<span class="mx-2">/</span>
								{/if}
								{#if crumb.isLast}
									<span class="font-medium text-foreground">{crumb.label}</span>
								{:else}
									<a href={crumb.href} class="hover:text-foreground">{crumb.label}</a>
								{/if}
							{/each}
						</div>
					</div>
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
				<!-- Search -->
				<div class="relative hidden sm:block">
					<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						type="search"
						name="q"
						placeholder="Search..."
						class="h-9 w-48 rounded-lg border border-border/50 bg-muted/30 py-2 pr-4 pl-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary lg:w-64"
					/>
				</div>

				<ThemeToggle />

				{#if user}
					<!-- User Menu (CSS Dropdown) -->
					<div class="group relative z-50">
						<button
							class="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent focus:outline-none"
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

						<!-- Dropdown Content -->
						<div
							class="absolute top-full right-0 mt-2 hidden w-56 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none group-hover:block focus-within:block"
						>
							<div class="px-2 py-1.5">
								<p class="text-sm font-medium text-foreground">{user.name}</p>
								<p class="text-xs text-muted-foreground">{user.email}</p>
							</div>
							<Separator class="my-1" />
							{#if isAdmin(user?.role)}
								<a
									href="/admin"
									class="relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm text-amber-500 transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground"
								>
									<Shield class="mr-2 h-4 w-4" />
									<span>Admin Panel</span>
								</a>
							{/if}
							<a
								href="/dashboard"
								class="relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm text-primary transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground"
							>
								<BarChart3 class="mr-2 h-4 w-4" />
								<span>Dashboard</span>
							</a>
							<a
								href="/profile"
								class="relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm text-primary transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground"
							>
								<UserIcon class="mr-2 h-4 w-4" />
								<span>Profile</span>
							</a>
							<a
								href="/settings"
								class="relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm text-primary transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground"
							>
								<Settings class="mr-2 h-4 w-4" />
								<span>Settings</span>
							</a>
							<Separator class="my-1" />
							<form action="/auth/sign-out" method="POST" class="w-full">
								<button
									type="submit"
									class="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm text-destructive transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground"
								>
									<LogOut class="mr-2 h-4 w-4" />
									<span>Sign out</span>
								</button>
							</form>
						</div>
					</div>
				{:else}
					<!-- Auth buttons -->
					<div class="hidden items-center gap-2 sm:flex">
						<Button variant="ghost" href="/auth/sign-in">Sign in</Button>
						<Button href="/auth/sign-up">Get Started</Button>
					</div>
				{/if}

				{#if !isDashboardPaths}
					<!-- Mobile menu button (Checkbox Hack) -->
					<label class="relative z-50 cursor-pointer p-2 md:hidden">
						<input type="checkbox" class="peer hidden" id="mobile-menu-toggle" />
						<Menu class="h-5 w-5 peer-checked:hidden" />
						<X class="hidden h-5 w-5 peer-checked:block" />

						<!-- Mobile Menu Dropdown -->
						<div
							class="absolute top-12 right-[-10px] hidden w-[300px] rounded-md border border-border bg-background shadow-lg peer-checked:block sm:right-0"
						>
							<div class="space-y-1 px-4 py-4">
								{#each navLinks as link}
									{#if !link.auth || user}
										<a
											href={link.href}
											class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
					</label>
				{/if}
			</div>
		</div>
	</div>
</header>
