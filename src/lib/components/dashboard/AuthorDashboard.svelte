<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import FileText from '@lucide/svelte/icons/file-text';
	import Eye from '@lucide/svelte/icons/eye';
	import Heart from '@lucide/svelte/icons/heart';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import PlusCircle from '@lucide/svelte/icons/plus-circle';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Clock from '@lucide/svelte/icons/clock';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import { Separator } from '$lib/components/ui/separator';

	interface Props {
		userName: string;
	}

	let { userName }: Props = $props();

	// Author stats
	const stats = [
		{
			label: 'Total Posts',
			value: '24',
			change: '+3 this week',
			trend: 'up',
			icon: FileText,
			color: 'from-blue-500 to-blue-600'
		},
		{
			label: 'Total Views',
			value: '12.4K',
			change: '+18% from last month',
			trend: 'up',
			icon: Eye,
			color: 'from-emerald-500 to-emerald-600'
		},
		{
			label: 'Likes',
			value: '892',
			change: '+127 this week',
			trend: 'up',
			icon: Heart,
			color: 'from-pink-500 to-pink-600'
		},
		{
			label: 'Comments',
			value: '156',
			change: '+23 new',
			trend: 'up',
			icon: MessageCircle,
			color: 'from-violet-500 to-violet-600'
		}
	];

	const recentPosts = [
		{
			title: 'Getting Started with SvelteKit 2.0',
			status: 'published',
			views: 1240,
			likes: 89,
			date: '2 days ago'
		},
		{
			title: 'The Future of Web Development',
			status: 'published',
			views: 856,
			likes: 67,
			date: '5 days ago'
		},
		{
			title: 'Building Beautiful UIs with Tailwind',
			status: 'draft',
			views: 0,
			likes: 0,
			date: '1 week ago'
		},
		{
			title: 'Understanding TypeScript Generics',
			status: 'published',
			views: 2103,
			likes: 145,
			date: '2 weeks ago'
		}
	];
</script>

<div class="space-y-6">
	<!-- Welcome section -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-foreground">
				Welcome back, {userName.split(' ')[0]}!
			</h1>
			<p class="mt-1 text-muted-foreground">Here's what's happening with your blog today.</p>
		</div>
		<Button href="/dashboard/posts/new" class="gap-2">
			<PlusCircle class="h-4 w-4" />
			Create New Post
		</Button>
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
							<p class="mt-1 flex items-center gap-1 text-xs text-emerald-500">
								<TrendingUp class="h-3 w-3" />
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
		<!-- Recent Posts -->
		<div class="lg:col-span-2">
			<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
				<Card.Header class="flex flex-row items-center justify-between">
					<div>
						<Card.Title class="text-lg">Recent Posts</Card.Title>
						<Card.Description>Your latest blog posts and drafts</Card.Description>
					</div>
					<Button variant="ghost" size="sm" href="/dashboard/posts" class="gap-1">
						View all
						<ArrowUpRight class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						{#each recentPosts as post, i}
							{#if i > 0}
								<Separator class="bg-border/50" />
							{/if}
							<div
								class="group flex items-start justify-between gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
							>
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2">
										<h3
											class="truncate font-medium text-foreground transition-colors group-hover:text-primary"
										>
											{post.title}
										</h3>
										<span
											class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium {post.status ===
											'published'
												? 'bg-emerald-500/10 text-emerald-500'
												: 'bg-yellow-500/10 text-yellow-500'}"
										>
											{post.status}
										</span>
									</div>
									<div class="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
										<span class="flex items-center gap-1">
											<Clock class="h-3 w-3" />
											{post.date}
										</span>
										{#if post.status === 'published'}
											<span class="flex items-center gap-1">
												<Eye class="h-3 w-3" />
												{post.views.toLocaleString()}
											</span>
											<span class="flex items-center gap-1">
												<Heart class="h-3 w-3" />
												{post.likes}
											</span>
										{/if}
									</div>
								</div>
								<Button variant="ghost" size="sm">Edit</Button>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Writing Streak & Quick Stats -->
		<div class="space-y-6">
			<!-- Writing Streak -->
			<Card.Root
				class="relative overflow-hidden border-border/50 bg-linear-to-br from-primary/10 via-card/50 to-chart-2/10 backdrop-blur-sm"
			>
				<div
					class="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl"
				></div>
				<Card.Header>
					<div class="flex items-center gap-2">
						<div class="rounded-lg bg-primary/10 p-2">
							<Sparkles class="h-5 w-5 text-primary" />
						</div>
						<div>
							<Card.Title class="text-lg">Writing Streak</Card.Title>
							<Card.Description>Keep the momentum going!</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="flex items-baseline gap-2">
						<span class="text-4xl font-bold text-foreground">7</span>
						<span class="text-muted-foreground">days</span>
					</div>
					<p class="mt-2 text-sm text-muted-foreground">
						You've been writing consistently for a week! Keep it up.
					</p>
					<div class="mt-4 flex gap-1">
						{#each Array(7) as _, i}
							<div
								class="h-2 flex-1 rounded-full bg-primary {i < 5 ? 'opacity-100' : 'opacity-30'}"
							></div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Quick Actions -->
			<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
				<Card.Header>
					<Card.Title class="text-lg">Quick Actions</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-2">
					<Button href="/dashboard/posts/new" class="w-full justify-start gap-2">
						<PlusCircle class="h-4 w-4" />
						New Post
					</Button>
					<Button variant="outline" href="/dashboard/analytics" class="w-full justify-start gap-2">
						<BarChart3 class="h-4 w-4" />
						View Analytics
					</Button>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
