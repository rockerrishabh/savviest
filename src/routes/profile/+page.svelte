<script lang="ts">
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import UserIcon from '@lucide/svelte/icons/user';
	import Mail from '@lucide/svelte/icons/mail';
	import Shield from '@lucide/svelte/icons/shield';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Edit from '@lucide/svelte/icons/edit';
	import Save from '@lucide/svelte/icons/save';
	import X from '@lucide/svelte/icons/x';
	import BadgeCheck from '@lucide/svelte/icons/badge-check';
	import Clock from '@lucide/svelte/icons/clock';
	import Eye from '@lucide/svelte/icons/eye';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Heart from '@lucide/svelte/icons/heart';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Camera from '@lucide/svelte/icons/camera';
	import Key from '@lucide/svelte/icons/key';
	import LinkIcon from '@lucide/svelte/icons/link';
	import TwoFactorAuth from '$lib/components/TwoFactorAuth.svelte';
	import PasskeyManager from '$lib/components/PasskeyManager.svelte';
	import LinkedAccounts from '$lib/components/LinkedAccounts.svelte';

	// Get user data from page store
	let user = $derived(page.data.user);

	// 2FA status
	let twoFactorEnabled = $derived(user?.twoFactorEnabled ?? false);

	// Edit mode state
	let isEditing = $state(false);
	let isLoading = $state(false);

	// Form state - initialized empty, synced via $effect below
	let formData = $state({
		name: '',
		image: ''
	});

	// Reset form data when user changes
	$effect(() => {
		if (user) {
			formData.name = user.name ?? '';
			formData.image = user.image ?? '';
		}
	});

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const formatDate = (date: Date | string | null | undefined) => {
		if (!date) return 'N/A';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(date));
	};

	const getRoleBadge = (role: string | null | undefined) => {
		switch (role) {
			case 'admin':
				return { label: 'Administrator', color: 'from-amber-500 to-orange-500' };
			case 'author':
				return { label: 'Author', color: 'from-purple-500 to-violet-500' };
			default:
				return { label: 'Member', color: 'from-blue-500 to-cyan-500' };
		}
	};

	const handleSave = async () => {
		if (!formData.name.trim()) {
			toast.error('Name is required');
			return;
		}

		isLoading = true;
		try {
			await authClient.updateUser({
				name: formData.name,
				image: formData.image || undefined
			});
			toast.success('Profile updated successfully');
			await invalidateAll();
			isEditing = false;
		} catch (error) {
			toast.error('Failed to update profile');
		} finally {
			isLoading = false;
		}
	};

	const handleCancel = () => {
		formData.name = user?.name ?? '';
		formData.image = user?.image ?? '';
		isEditing = false;
	};

	// Activity stats (mock data - replace with real data)
	const stats = [
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
		},
		{
			label: 'Bookmarks',
			value: '12',
			change: '+2 this week',
			icon: Bookmark,
			color: 'from-blue-500 to-blue-600'
		}
	];

	const roleBadge = $derived(getRoleBadge(user?.role));
</script>

<svelte:head>
	<title>Profile | BlogSpace</title>
	<meta name="description" content="View and manage your BlogSpace profile." />
</svelte:head>

<div class="min-h-screen bg-background">
	<div class="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
		<!-- Profile Header -->
		<div class="relative">
			<!-- Banner -->
			<div
				class="h-32 overflow-hidden rounded-t-2xl bg-linear-to-r from-primary/20 via-chart-2/20 to-primary/20 sm:h-48"
			>
				<div
					class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptLTEgMGMtNy4xOCAwLTEzIDUuODItMTMgMTNzNS44MiAxMyAxMyAxMyAxMy01LjgyIDEzLTEzLTUuODItMTMtMTMtMTN6IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30"
				></div>
			</div>

			<!-- Profile Info Card -->
			<Card.Root
				class="relative mx-4 -mt-16 border-border/50 bg-card/80 backdrop-blur-xl sm:mx-8 sm:-mt-24"
			>
				<Card.Content class="pt-6 pb-6">
					<div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
						<!-- Avatar -->
						<div class="relative -mt-20 sm:-mt-28">
							<div
								class="rounded-full bg-linear-to-br from-primary to-chart-2 p-1 shadow-xl shadow-primary/20"
							>
								<Avatar.Root class="h-28 w-28 border-4 border-card sm:h-36 sm:w-36">
									{#if user?.image}
										<Avatar.Image src={user.image} alt={user?.name} />
									{/if}
									<Avatar.Fallback
										class="bg-linear-to-br from-primary to-chart-2 text-2xl font-bold text-primary-foreground sm:text-3xl"
									>
										{getInitials(user?.name ?? 'User')}
									</Avatar.Fallback>
								</Avatar.Root>
							</div>
							{#if isEditing}
								<button
									class="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-transform hover:scale-110"
								>
									<Camera class="h-4 w-4" />
								</button>
							{/if}
						</div>

						<!-- User Details -->
						<div class="flex-1 text-center sm:text-left">
							<div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
								<div>
									<div class="flex items-center gap-3">
										<h1 class="text-2xl font-bold text-foreground sm:text-3xl">
											{user?.name ?? 'User'}
										</h1>
										{#if user?.emailVerified}
											<BadgeCheck class="h-6 w-6 text-primary" />
										{/if}
									</div>
									<p class="mt-1 text-muted-foreground">{user?.email}</p>
								</div>

								<div class="flex items-center gap-2">
									{#if isEditing}
										<Button variant="outline" size="sm" onclick={handleCancel} disabled={isLoading}>
											<X class="mr-1 h-4 w-4" />
											Cancel
										</Button>
										<Button size="sm" onclick={handleSave} disabled={isLoading}>
											<Save class="mr-1 h-4 w-4" />
											{isLoading ? 'Saving...' : 'Save'}
										</Button>
									{:else}
										<Button variant="outline" size="sm" onclick={() => (isEditing = true)}>
											<Edit class="mr-1 h-4 w-4" />
											Edit Profile
										</Button>
									{/if}
								</div>
							</div>

							<!-- Role Badge & Join Date -->
							<div class="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
								<span
									class="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r {roleBadge.color} px-3 py-1 text-sm font-medium text-white shadow-lg"
								>
									<Shield class="h-3.5 w-3.5" />
									{roleBadge.label}
								</span>
								<span class="flex items-center gap-1.5 text-sm text-muted-foreground">
									<Calendar class="h-4 w-4" />
									Joined {formatDate(user?.createdAt)}
								</span>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Tabs Section -->
		<Tabs.Root value="details" class="space-y-6">
			<Tabs.List class="bg-muted/50 backdrop-blur-sm">
				<Tabs.Trigger value="details">Profile Details</Tabs.Trigger>
				<Tabs.Trigger value="activity">Recent Activity</Tabs.Trigger>
				<Tabs.Trigger value="security">Security</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="details">
				<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
					<Card.Header>
						<Card.Title>Profile Information</Card.Title>
						<Card.Description>
							{isEditing ? 'Update your profile information below.' : 'Your personal details.'}
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-6">
						{#if isEditing}
							<!-- Edit Mode -->
							<div class="grid gap-6 sm:grid-cols-2">
								<div class="space-y-2">
									<Label for="name">Full Name</Label>
									<Input id="name" bind:value={formData.name} placeholder="Enter your name" />
								</div>
								<div class="space-y-2">
									<Label for="email">Email Address</Label>
									<Input id="email" value={user?.email} disabled class="bg-muted/50" />
									<p class="text-xs text-muted-foreground">Email cannot be changed</p>
								</div>
								<div class="space-y-2 sm:col-span-2">
									<Label for="image">Profile Image URL</Label>
									<Input
										id="image"
										bind:value={formData.image}
										placeholder="https://example.com/avatar.jpg"
									/>
								</div>
							</div>
						{:else}
							<!-- View Mode -->
							<div class="grid gap-6 sm:grid-cols-2">
								<div class="space-y-2">
									<Label class="text-muted-foreground">Full Name</Label>
									<div
										class="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5"
									>
										<UserIcon class="h-4 w-4 text-muted-foreground" />
										<span class="font-medium">{user?.name ?? 'Not set'}</span>
									</div>
								</div>
								<div class="space-y-2">
									<Label class="text-muted-foreground">Email Address</Label>
									<div
										class="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5"
									>
										<Mail class="h-4 w-4 text-muted-foreground" />
										<span class="font-medium">{user?.email}</span>
										{#if user?.emailVerified}
											<BadgeCheck class="ml-auto h-4 w-4 text-emerald-500" />
										{/if}
									</div>
								</div>
								<div class="space-y-2">
									<Label class="text-muted-foreground">Role</Label>
									<div
										class="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5"
									>
										<Shield class="h-4 w-4 text-muted-foreground" />
										<span class="font-medium capitalize">{user?.role ?? 'user'}</span>
									</div>
								</div>
								<div class="space-y-2">
									<Label class="text-muted-foreground">Member Since</Label>
									<div
										class="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5"
									>
										<Calendar class="h-4 w-4 text-muted-foreground" />
										<span class="font-medium">{formatDate(user?.createdAt)}</span>
									</div>
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="activity">
				<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
					<Card.Header>
						<Card.Title>Recent Activity</Card.Title>
						<Card.Description>Your latest actions and engagement on BlogSpace.</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							{#each [{ action: 'Commented on', target: 'Understanding Modern JavaScript', time: '2 hours ago', icon: MessageCircle }, { action: 'Liked', target: 'CSS Grid vs Flexbox', time: '5 hours ago', icon: Heart }, { action: 'Bookmarked', target: 'Building Accessible Web Apps', time: '1 day ago', icon: Bookmark }, { action: 'Read', target: 'Getting Started with TypeScript', time: '2 days ago', icon: Eye }, { action: 'Commented on', target: 'React Hooks Deep Dive', time: '3 days ago', icon: MessageCircle }] as activity}
								<div
									class="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
								>
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
									>
										<activity.icon class="h-5 w-5" />
									</div>
									<div class="min-w-0 flex-1">
										<p class="text-sm">
											<span class="text-muted-foreground">{activity.action}</span>
											<span class="font-medium text-foreground"> "{activity.target}"</span>
										</p>
										<p class="flex items-center gap-1 text-xs text-muted-foreground">
											<Clock class="h-3 w-3" />
											{activity.time}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="security">
				<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
					<Card.Header>
						<Card.Title>Security Settings</Card.Title>
						<Card.Description>Manage your account security and authentication.</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-6">
						<div class="flex items-center justify-between rounded-lg border border-border/50 p-4">
							<div class="flex items-center gap-4">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10"
								>
									<BadgeCheck class="h-5 w-5 text-emerald-500" />
								</div>
								<div>
									<p class="font-medium">Email Verification</p>
									<p class="text-sm text-muted-foreground">
										{user?.emailVerified ? 'Your email is verified' : 'Please verify your email'}
									</p>
								</div>
							</div>
							<span
								class="rounded-full px-3 py-1 text-sm {user?.emailVerified
									? 'bg-emerald-500/10 text-emerald-500'
									: 'bg-amber-500/10 text-amber-500'}"
							>
								{user?.emailVerified ? 'Verified' : 'Pending'}
							</span>
						</div>

						<Separator />

						<div>
							<h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
								<Shield class="h-4 w-4" />
								Two-Factor Authentication
							</h3>
							<TwoFactorAuth {twoFactorEnabled} />
						</div>

						<Separator />

						<div>
							<h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
								<Key class="h-4 w-4" />
								Passkeys
							</h3>
							<PasskeyManager />
						</div>

						<Separator />

						<div>
							<h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
								<LinkIcon class="h-4 w-4" />
								Linked Accounts
							</h3>
							<LinkedAccounts />
						</div>

						<Separator />

						<div class="flex items-center justify-between rounded-lg border border-border/50 p-4">
							<div class="flex items-center gap-4">
								<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
									<Clock class="h-5 w-5 text-primary" />
								</div>
								<div>
									<p class="font-medium">Session Management</p>
									<p class="text-sm text-muted-foreground">Manage your active sessions</p>
								</div>
							</div>
							<Button variant="outline" size="sm" href="/settings">View Sessions</Button>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
