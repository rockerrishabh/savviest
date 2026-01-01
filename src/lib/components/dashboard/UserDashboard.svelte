<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Clock from '@lucide/svelte/icons/clock';
	import Heart from '@lucide/svelte/icons/heart';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Eye from '@lucide/svelte/icons/eye';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import PenLine from '@lucide/svelte/icons/pen-line';

	interface Props {
		userName: string;
	}

	let { userName }: Props = $props();

	// User stats
	const stats = [
		{
			label: 'Bookmarks',
			value: '12',
			change: '+2 this week',
			icon: Bookmark,
			color: 'from-blue-500 to-blue-600'
		},
		{
			label: 'Articles Read',
			value: '47',
			change: '+8 this month',
			icon: Eye,
			color: 'from-emerald-500 to-emerald-600'
		},
		{
			label: 'Comments',
			value: '23',
			change: '+5 this week',
			icon: MessageCircle,
			color: 'from-violet-500 to-violet-600'
		},
		{
			label: 'Likes Given',
			value: '89',
			change: '+12 this week',
			icon: Heart,
			color: 'from-pink-500 to-pink-600'
		}
	];

	// Sample bookmarked posts
	const bookmarkedPosts = [
		{
			title: 'Understanding Modern JavaScript',
			author: 'Jane Smith',
			readTime: '8 min',
			date: '3 days ago'
		},
		{
			title: 'CSS Grid vs Flexbox: When to Use What',
			author: 'John Doe',
			readTime: '6 min',
			date: '1 week ago'
		},
		{
			title: 'Building Accessible Web Apps',
			author: 'Sarah Johnson',
			readTime: '10 min',
			date: '2 weeks ago'
		}
	];

	// Reading history
	const readingHistory = [
		{
			title: 'Getting Started with TypeScript',
			progress: 100,
			date: 'Today'
		},
		{
			title: 'React Hooks Deep Dive',
			progress: 75,
			date: 'Yesterday'
		},
		{
			title: 'Database Design Fundamentals',
			progress: 30,
			date: '2 days ago'
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
			<p class="mt-1 text-muted-foreground">
				Discover great content and track your reading journey.
			</p>
		</div>
		<Button href="/" class="gap-2">
			<Sparkles class="h-4 w-4" />
			Explore Articles
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
		<!-- Bookmarked Posts -->
		<div class="lg:col-span-2">
			<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
				<Card.Header class="flex flex-row items-center justify-between">
					<div>
						<Card.Title class="text-lg">Bookmarked Posts</Card.Title>
						<Card.Description>Articles you've saved for later</Card.Description>
					</div>
					<Button variant="ghost" size="sm" href="/dashboard/bookmarks" class="gap-1">
						View all
						<ArrowUpRight class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						{#each bookmarkedPosts as post, i}
							{#if i > 0}
								<Separator class="bg-border/50" />
							{/if}
							<div
								class="group flex items-start justify-between gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
							>
								<div class="min-w-0 flex-1">
									<h3
										class="truncate font-medium text-foreground transition-colors group-hover:text-primary"
									>
										{post.title}
									</h3>
									<div class="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
										<span>by {post.author}</span>
										<span class="flex items-center gap-1">
											<Clock class="h-3 w-3" />
											{post.readTime}
										</span>
									</div>
								</div>
								<Button variant="ghost" size="sm">Read</Button>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Reading Progress & CTA -->
		<div class="space-y-6">
			<!-- Reading Progress -->
			<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
				<Card.Header>
					<Card.Title class="text-lg">Continue Reading</Card.Title>
					<Card.Description>Pick up where you left off</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						{#each readingHistory as article}
							<div class="group cursor-pointer rounded-lg p-2 transition-colors hover:bg-muted/50">
								<div class="flex items-center justify-between">
									<h4 class="truncate text-sm font-medium text-foreground group-hover:text-primary">
										{article.title}
									</h4>
									<span class="text-xs text-muted-foreground">{article.date}</span>
								</div>
								<div class="mt-2 flex items-center gap-2">
									<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
										<div
											class="h-full rounded-full bg-primary transition-all"
											style="width: {article.progress}%"
										></div>
									</div>
									<span class="text-xs font-medium text-muted-foreground">{article.progress}%</span>
								</div>
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Become an Author CTA -->
			<Card.Root
				class="relative overflow-hidden border-border/50 bg-linear-to-br from-primary/10 via-card/50 to-chart-2/10 backdrop-blur-sm"
			>
				<div
					class="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl"
				></div>
				<Card.Header>
					<div class="flex items-center gap-2">
						<div class="rounded-lg bg-primary/10 p-2">
							<PenLine class="h-5 w-5 text-primary" />
						</div>
						<Card.Title class="text-lg">Become an Author</Card.Title>
					</div>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						Share your knowledge and expertise with our community. Start writing and reach thousands
						of readers.
					</p>
					<Button class="mt-4 w-full gap-2">
						<PenLine class="h-4 w-4" />
						Apply to Write
					</Button>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
