<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import Users from '@lucide/svelte/icons/users';
	import FileText from '@lucide/svelte/icons/file-text';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Eye from '@lucide/svelte/icons/eye';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import TrendingDown from '@lucide/svelte/icons/trending-down';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Shield from '@lucide/svelte/icons/shield';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import Ban from '@lucide/svelte/icons/ban';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Clock from '@lucide/svelte/icons/clock';

	// Admin stats
	const stats = [
		{
			label: 'Total Users',
			value: '2,847',
			change: '+124 this month',
			trend: 'up',
			icon: Users,
			color: 'from-blue-500 to-blue-600'
		},
		{
			label: 'Total Posts',
			value: '1,234',
			change: '+89 this week',
			trend: 'up',
			icon: FileText,
			color: 'from-emerald-500 to-emerald-600'
		},
		{
			label: 'Page Views',
			value: '284K',
			change: '+32% from last month',
			trend: 'up',
			icon: Eye,
			color: 'from-violet-500 to-violet-600'
		},
		{
			label: 'Comments',
			value: '5,678',
			change: '-5% from last week',
			trend: 'down',
			icon: MessageCircle,
			color: 'from-pink-500 to-pink-600'
		}
	];

	// Recent users
	const recentUsers = [
		{
			name: 'Alice Johnson',
			email: 'alice@example.com',
			role: 'author',
			status: 'active',
			joinedAt: '2 hours ago'
		},
		{
			name: 'Bob Smith',
			email: 'bob@example.com',
			role: 'user',
			status: 'active',
			joinedAt: '5 hours ago'
		},
		{
			name: 'Carol Davis',
			email: 'carol@example.com',
			role: 'user',
			status: 'pending',
			joinedAt: '1 day ago'
		},
		{
			name: 'David Wilson',
			email: 'david@example.com',
			role: 'author',
			status: 'banned',
			joinedAt: '2 days ago'
		}
	];

	// Recent activity
	const recentActivity = [
		{
			type: 'user_signup',
			message: 'New user registered: alice@example.com',
			time: '2 hours ago',
			icon: UserPlus,
			color: 'text-emerald-500'
		},
		{
			type: 'post_published',
			message: 'New post published: "Getting Started with SvelteKit"',
			time: '3 hours ago',
			icon: FileText,
			color: 'text-blue-500'
		},
		{
			type: 'user_banned',
			message: 'User banned: spammer@example.com',
			time: '5 hours ago',
			icon: Ban,
			color: 'text-red-500'
		},
		{
			type: 'report',
			message: 'New report on comment #1234',
			time: '6 hours ago',
			icon: AlertTriangle,
			color: 'text-yellow-500'
		}
	];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return { class: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle };
			case 'pending':
				return { class: 'bg-yellow-500/10 text-yellow-500', icon: Clock };
			case 'banned':
				return { class: 'bg-red-500/10 text-red-500', icon: Ban };
			default:
				return { class: 'bg-gray-500/10 text-gray-500', icon: Users };
		}
	};

	const getRoleBadge = (role: string) => {
		switch (role) {
			case 'admin':
				return 'bg-amber-500/10 text-amber-500';
			case 'author':
				return 'bg-blue-500/10 text-blue-500';
			default:
				return 'bg-gray-500/10 text-gray-500';
		}
	};
</script>

<svelte:head>
	<title>Admin Dashboard | BlogSpace</title>
	<meta
		name="description"
		content="BlogSpace admin dashboard - manage users, posts, and site settings."
	/>
</svelte:head>

<div class="space-y-6">
	<!-- Welcome section -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
					<Shield class="h-5 w-5 text-amber-500" />
				</div>
				<div>
					<h1 class="text-2xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
					<p class="text-sm text-muted-foreground">Manage your platform and users</p>
				</div>
			</div>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" href="/admin/users" class="gap-2">
				<Users class="h-4 w-4" />
				Manage Users
			</Button>
			<Button href="/admin/settings" class="gap-2">Site Settings</Button>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<Card.Root
				class="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:shadow-lg"
			>
				<div
					class="absolute inset-0 bg-linear-to-br {stat.color} opacity-0 transition-opacity group-hover:opacity-5"
				></div>
				<Card.Content class="p-6">
					<div class="flex items-start justify-between">
						<div>
							<p class="text-sm font-medium text-muted-foreground">{stat.label}</p>
							<p class="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
							<p
								class="mt-1 flex items-center gap-1 text-xs {stat.trend === 'up'
									? 'text-emerald-500'
									: 'text-red-500'}"
							>
								{#if stat.trend === 'up'}
									<TrendingUp class="h-3 w-3" />
								{:else}
									<TrendingDown class="h-3 w-3" />
								{/if}
								{stat.change}
							</p>
						</div>
						<div class="rounded-xl bg-linear-to-br {stat.color} p-3 text-white shadow-lg">
							<stat.icon class="h-5 w-5" />
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Recent Users -->
		<div class="lg:col-span-2">
			<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
				<Card.Header class="flex flex-row items-center justify-between">
					<div>
						<Card.Title class="text-lg">Recent Users</Card.Title>
						<Card.Description>Newly registered users</Card.Description>
					</div>
					<Button variant="ghost" size="sm" href="/admin/users" class="gap-1">
						View all
						<ArrowUpRight class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						{#each recentUsers as user, i}
							{#if i > 0}
								<Separator class="bg-border/50" />
							{/if}
							{@const statusBadge = getStatusBadge(user.status)}
							<div
								class="group flex items-center justify-between gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
							>
								<div class="flex items-center gap-3">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium"
									>
										{user.name
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</div>
									<div>
										<div class="flex items-center gap-2">
											<h4 class="font-medium text-foreground">{user.name}</h4>
											<span
												class="rounded-full px-2 py-0.5 text-xs font-medium {getRoleBadge(
													user.role
												)}"
											>
												{user.role}
											</span>
										</div>
										<p class="text-sm text-muted-foreground">{user.email}</p>
									</div>
								</div>
								<div class="flex items-center gap-3">
									<span
										class="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium {statusBadge.class}"
									>
										<statusBadge.icon class="h-3 w-3" />
										{user.status}
									</span>
									<span class="text-xs text-muted-foreground">{user.joinedAt}</span>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Recent Activity -->
		<div>
			<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
				<Card.Header>
					<Card.Title class="text-lg">Recent Activity</Card.Title>
					<Card.Description>Latest platform activity</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						{#each recentActivity as activity}
							<div class="flex items-start gap-3">
								<div class="mt-0.5 rounded-lg bg-muted p-2">
									<activity.icon class="h-4 w-4 {activity.color}" />
								</div>
								<div class="flex-1">
									<p class="text-sm text-foreground">{activity.message}</p>
									<p class="text-xs text-muted-foreground">{activity.time}</p>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
