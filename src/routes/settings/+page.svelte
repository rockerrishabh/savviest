<script lang="ts">
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Separator } from '$lib/components/ui/separator';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import TwoFactorAuth from '$lib/components/TwoFactorAuth.svelte';
	import PasskeyManager from '$lib/components/PasskeyManager.svelte';
	import LinkedAccounts from '$lib/components/LinkedAccounts.svelte';
	import Settings from '@lucide/svelte/icons/settings';
	import Bell from '@lucide/svelte/icons/bell';
	import Shield from '@lucide/svelte/icons/shield';
	import Eye from '@lucide/svelte/icons/eye';
	import Palette from '@lucide/svelte/icons/palette';
	import Key from '@lucide/svelte/icons/key';
	import Lock from '@lucide/svelte/icons/lock';
	import Mail from '@lucide/svelte/icons/mail';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import Globe from '@lucide/svelte/icons/globe';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Save from '@lucide/svelte/icons/save';
	import Monitor from '@lucide/svelte/icons/monitor';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Link from '@lucide/svelte/icons/link';

	let user = $derived(page.data.user);

	// Settings state
	let notificationSettings = $state({
		emailNotifications: true,
		newsletterSubscription: false,
		newCommentNotification: true,
		mentionNotification: true,
		followNotification: true,
		weeklyDigest: false
	});

	let privacySettings = $state({
		showProfile: true,
		showActivity: true,
		showReadingHistory: false,
		allowIndexing: true
	});

	let appearanceSettings = $state({
		theme: 'system' as 'light' | 'dark' | 'system',
		compactMode: false,
		reducedMotion: false
	});

	// Password change state
	let passwordData = $state({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});

	// 2FA status from user data
	let twoFactorEnabled = $derived(user?.twoFactorEnabled ?? false);

	// Loading states
	let isSavingNotifications = $state(false);
	let isSavingPrivacy = $state(false);
	let isChangingPassword = $state(false);
	let isDeletingAccount = $state(false);

	const handleSaveNotifications = async () => {
		isSavingNotifications = true;
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success('Notification settings saved');
		} catch (error) {
			toast.error('Failed to save notification settings');
		} finally {
			isSavingNotifications = false;
		}
	};

	const handleSavePrivacy = async () => {
		isSavingPrivacy = true;
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success('Privacy settings saved');
		} catch (error) {
			toast.error('Failed to save privacy settings');
		} finally {
			isSavingPrivacy = false;
		}
	};

	const handleChangePassword = async () => {
		if (
			!passwordData.currentPassword ||
			!passwordData.newPassword ||
			!passwordData.confirmPassword
		) {
			toast.error('Please fill in all password fields');
			return;
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error('New passwords do not match');
			return;
		}

		if (passwordData.newPassword.length < 8) {
			toast.error('Password must be at least 8 characters');
			return;
		}

		isChangingPassword = true;
		try {
			await authClient.changePassword({
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
				revokeOtherSessions: true
			});
			toast.success('Password changed successfully');
			passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
		} catch (error) {
			toast.error('Failed to change password. Please check your current password.');
		} finally {
			isChangingPassword = false;
		}
	};

	const handleDeleteAccount = async () => {
		if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
			return;
		}

		isDeletingAccount = true;
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));
			toast.error('Account deletion is currently disabled for demo purposes');
		} catch (error) {
			toast.error('Failed to delete account');
		} finally {
			isDeletingAccount = false;
		}
	};

	const settingsTabs = [
		{ value: 'notifications', label: 'Notifications', icon: Bell },
		{ value: 'privacy', label: 'Privacy', icon: Eye },
		{ value: 'security', label: 'Security', icon: Shield },
		{ value: 'appearance', label: 'Appearance', icon: Palette },
		{ value: 'account', label: 'Account', icon: Settings }
	];
</script>

<svelte:head>
	<title>Settings | BlogSpace</title>
	<meta name="description" content="Manage your BlogSpace account settings and preferences." />
</svelte:head>

<div class="min-h-screen bg-background">
	<div class="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Settings</h1>
			<p class="mt-2 text-muted-foreground">Manage your account settings and preferences.</p>
		</div>

		<!-- Settings Tabs -->
		<Tabs.Root value="notifications" class="space-y-6">
			<Tabs.List class="flex flex-wrap gap-1 bg-muted/50 p-1 backdrop-blur-sm">
				{#each settingsTabs as tab}
					<Tabs.Trigger value={tab.value} class="flex items-center gap-2">
						<tab.icon class="h-4 w-4" />
						<span class="hidden sm:inline">{tab.label}</span>
					</Tabs.Trigger>
				{/each}
			</Tabs.List>

			<!-- Notifications Tab -->
			<Tabs.Content value="notifications">
				<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<Bell class="h-5 w-5 text-primary" />
							Notification Preferences
						</Card.Title>
						<Card.Description>
							Choose how you want to be notified about activity on BlogSpace.
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-6">
						<!-- Email Notifications Section -->
						<div>
							<h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
								<Mail class="h-4 w-4" />
								Email Notifications
							</h3>
							<div class="space-y-4">
								<div
									class="flex items-center justify-between rounded-lg border border-border/50 p-4"
								>
									<div>
										<p class="font-medium">Email Notifications</p>
										<p class="text-sm text-muted-foreground">Receive notifications via email</p>
									</div>
									<Switch bind:checked={notificationSettings.emailNotifications} />
								</div>

								<div
									class="flex items-center justify-between rounded-lg border border-border/50 p-4"
								>
									<div>
										<p class="font-medium">Weekly Newsletter</p>
										<p class="text-sm text-muted-foreground">Get a weekly digest of top articles</p>
									</div>
									<Switch bind:checked={notificationSettings.newsletterSubscription} />
								</div>

								<div
									class="flex items-center justify-between rounded-lg border border-border/50 p-4"
								>
									<div>
										<p class="font-medium">Weekly Digest</p>
										<p class="text-sm text-muted-foreground">
											Summary of your activity and new content
										</p>
									</div>
									<Switch bind:checked={notificationSettings.weeklyDigest} />
								</div>
							</div>
						</div>

						<Separator />

						<!-- Activity Notifications Section -->
						<div>
							<h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
								<Globe class="h-4 w-4" />
								Activity Notifications
							</h3>
							<div class="space-y-4">
								<div
									class="flex items-center justify-between rounded-lg border border-border/50 p-4"
								>
									<div>
										<p class="font-medium">New Comments</p>
										<p class="text-sm text-muted-foreground">When someone comments on your posts</p>
									</div>
									<Switch bind:checked={notificationSettings.newCommentNotification} />
								</div>

								<div
									class="flex items-center justify-between rounded-lg border border-border/50 p-4"
								>
									<div>
										<p class="font-medium">Mentions</p>
										<p class="text-sm text-muted-foreground">When someone mentions you</p>
									</div>
									<Switch bind:checked={notificationSettings.mentionNotification} />
								</div>

								<div
									class="flex items-center justify-between rounded-lg border border-border/50 p-4"
								>
									<div>
										<p class="font-medium">New Followers</p>
										<p class="text-sm text-muted-foreground">When someone follows you</p>
									</div>
									<Switch bind:checked={notificationSettings.followNotification} />
								</div>
							</div>
						</div>

						<div class="flex justify-end pt-4">
							<Button onclick={handleSaveNotifications} disabled={isSavingNotifications}>
								{#if isSavingNotifications}
									<Loader2 class="mr-2 h-4 w-4 animate-spin" />
									Saving...
								{:else}
									<Save class="mr-2 h-4 w-4" />
									Save Changes
								{/if}
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Privacy Tab -->
			<Tabs.Content value="privacy">
				<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<Eye class="h-5 w-5 text-primary" />
							Privacy Settings
						</Card.Title>
						<Card.Description>Control what others can see about you on BlogSpace.</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-6">
						<div class="space-y-4">
							<div class="flex items-center justify-between rounded-lg border border-border/50 p-4">
								<div>
									<p class="font-medium">Public Profile</p>
									<p class="text-sm text-muted-foreground">Allow others to see your profile page</p>
								</div>
								<Switch bind:checked={privacySettings.showProfile} />
							</div>

							<div class="flex items-center justify-between rounded-lg border border-border/50 p-4">
								<div>
									<p class="font-medium">Show Activity</p>
									<p class="text-sm text-muted-foreground">
										Display your recent activity on your profile
									</p>
								</div>
								<Switch bind:checked={privacySettings.showActivity} />
							</div>

							<div class="flex items-center justify-between rounded-lg border border-border/50 p-4">
								<div>
									<p class="font-medium">Reading History</p>
									<p class="text-sm text-muted-foreground">
										Show articles you've read on your profile
									</p>
								</div>
								<Switch bind:checked={privacySettings.showReadingHistory} />
							</div>

							<div class="flex items-center justify-between rounded-lg border border-border/50 p-4">
								<div>
									<p class="font-medium">Search Engine Indexing</p>
									<p class="text-sm text-muted-foreground">
										Allow search engines to index your profile
									</p>
								</div>
								<Switch bind:checked={privacySettings.allowIndexing} />
							</div>
						</div>

						<div class="flex justify-end pt-4">
							<Button onclick={handleSavePrivacy} disabled={isSavingPrivacy}>
								{#if isSavingPrivacy}
									<Loader2 class="mr-2 h-4 w-4 animate-spin" />
									Saving...
								{:else}
									<Save class="mr-2 h-4 w-4" />
									Save Changes
								{/if}
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Security Tab -->
			<Tabs.Content value="security">
				<div class="space-y-6">
					<!-- Password Change -->
					<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<Key class="h-5 w-5 text-primary" />
								Change Password
							</Card.Title>
							<Card.Description>Update your password to keep your account secure.</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<div class="space-y-2">
									<Label for="currentPassword">Current Password</Label>
									<Input
										id="currentPassword"
										type="password"
										bind:value={passwordData.currentPassword}
										placeholder="Enter current password"
									/>
								</div>
								<div class="space-y-2">
									<Label for="newPassword">New Password</Label>
									<Input
										id="newPassword"
										type="password"
										bind:value={passwordData.newPassword}
										placeholder="Enter new password"
									/>
								</div>
								<div class="space-y-2">
									<Label for="confirmPassword">Confirm New Password</Label>
									<Input
										id="confirmPassword"
										type="password"
										bind:value={passwordData.confirmPassword}
										placeholder="Confirm new password"
									/>
								</div>
							</div>

							<div class="flex justify-end pt-2">
								<Button onclick={handleChangePassword} disabled={isChangingPassword}>
									{#if isChangingPassword}
										<Loader2 class="mr-2 h-4 w-4 animate-spin" />
										Changing...
									{:else}
										<Lock class="mr-2 h-4 w-4" />
										Change Password
									{/if}
								</Button>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Two-Factor Authentication -->
					<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<Smartphone class="h-5 w-5 text-primary" />
								Two-Factor Authentication
							</Card.Title>
							<Card.Description>Add an extra layer of security to your account.</Card.Description>
						</Card.Header>
						<Card.Content>
							<TwoFactorAuth {twoFactorEnabled} />
						</Card.Content>
					</Card.Root>

					<!-- Passkeys -->
					<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<Key class="h-5 w-5 text-primary" />
								Passkeys
							</Card.Title>
							<Card.Description>
								Sign in without a password using biometrics or security keys.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<PasskeyManager />
						</Card.Content>
					</Card.Root>

					<!-- Linked Accounts -->
					<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<Link class="h-5 w-5 text-primary" />
								Linked Accounts
							</Card.Title>
							<Card.Description>Connect multiple sign-in methods to your account.</Card.Description>
						</Card.Header>
						<Card.Content>
							<LinkedAccounts />
						</Card.Content>
					</Card.Root>

					<!-- Active Sessions -->
					<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<Monitor class="h-5 w-5 text-primary" />
								Active Sessions
							</Card.Title>
							<Card.Description>Manage your active sessions across devices.</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="space-y-4">
								<div
									class="flex items-center justify-between rounded-lg border border-primary/50 bg-primary/5 p-4"
								>
									<div class="flex items-center gap-4">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
										>
											<Monitor class="h-5 w-5 text-primary" />
										</div>
										<div>
											<p class="font-medium">Current Session</p>
											<p class="text-sm text-muted-foreground">Windows · Chrome · Active now</p>
										</div>
									</div>
									<span class="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-500">
										Current
									</span>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>

			<!-- Appearance Tab -->
			<Tabs.Content value="appearance">
				<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<Palette class="h-5 w-5 text-primary" />
							Appearance
						</Card.Title>
						<Card.Description>Customize how BlogSpace looks for you.</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-6">
						<!-- Theme Selection -->
						<div>
							<h3 class="mb-4 text-sm font-semibold text-foreground">Theme</h3>
							<div class="grid gap-4 sm:grid-cols-3">
								<button
									class="group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {appearanceSettings.theme ===
									'light'
										? 'border-primary bg-primary/5'
										: 'border-border/50 hover:border-border hover:bg-muted/50'}"
									onclick={() => (appearanceSettings.theme = 'light')}
								>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600"
									>
										<Sun class="h-6 w-6" />
									</div>
									<span class="font-medium">Light</span>
								</button>

								<button
									class="group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {appearanceSettings.theme ===
									'dark'
										? 'border-primary bg-primary/5'
										: 'border-border/50 hover:border-border hover:bg-muted/50'}"
									onclick={() => (appearanceSettings.theme = 'dark')}
								>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-200"
									>
										<Moon class="h-6 w-6" />
									</div>
									<span class="font-medium">Dark</span>
								</button>

								<button
									class="group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {appearanceSettings.theme ===
									'system'
										? 'border-primary bg-primary/5'
										: 'border-border/50 hover:border-border hover:bg-muted/50'}"
									onclick={() => (appearanceSettings.theme = 'system')}
								>
									<div
										class="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-amber-100 to-slate-800"
									>
										<Monitor class="h-6 w-6 text-slate-600" />
									</div>
									<span class="font-medium">System</span>
								</button>
							</div>
						</div>

						<Separator />

						<!-- Display Options -->
						<div>
							<h3 class="mb-4 text-sm font-semibold text-foreground">Display Options</h3>
							<div class="space-y-4">
								<div
									class="flex items-center justify-between rounded-lg border border-border/50 p-4"
								>
									<div>
										<p class="font-medium">Compact Mode</p>
										<p class="text-sm text-muted-foreground">
											Reduce spacing for more content density
										</p>
									</div>
									<Switch bind:checked={appearanceSettings.compactMode} />
								</div>

								<div
									class="flex items-center justify-between rounded-lg border border-border/50 p-4"
								>
									<div>
										<p class="font-medium">Reduced Motion</p>
										<p class="text-sm text-muted-foreground">
											Minimize animations throughout the app
										</p>
									</div>
									<Switch bind:checked={appearanceSettings.reducedMotion} />
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Account Tab -->
			<Tabs.Content value="account">
				<div class="space-y-6">
					<!-- Account Info -->
					<Card.Root class="border-border/50 bg-card/50 backdrop-blur-sm">
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<Settings class="h-5 w-5 text-primary" />
								Account Information
							</Card.Title>
							<Card.Description>View your account details.</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-4">
							<div class="grid gap-4 sm:grid-cols-2">
								<div class="space-y-2">
									<Label class="text-muted-foreground">Email Address</Label>
									<div class="rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5">
										<span class="font-medium">{user?.email}</span>
									</div>
								</div>
								<div class="space-y-2">
									<Label class="text-muted-foreground">Account Type</Label>
									<div class="rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5">
										<span class="font-medium capitalize">{user?.role ?? 'user'}</span>
									</div>
								</div>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Danger Zone -->
					<Card.Root class="border-destructive/50 bg-destructive/5 backdrop-blur-sm">
						<Card.Header>
							<Card.Title class="flex items-center gap-2 text-destructive">
								<AlertTriangle class="h-5 w-5" />
								Danger Zone
							</Card.Title>
							<Card.Description>
								Irreversible and destructive actions for your account.
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<p class="font-medium text-destructive">Delete Account</p>
									<p class="text-sm text-muted-foreground">
										Permanently delete your account and all associated data.
									</p>
								</div>
								<Button
									variant="destructive"
									onclick={handleDeleteAccount}
									disabled={isDeletingAccount}
								>
									{#if isDeletingAccount}
										<Loader2 class="mr-2 h-4 w-4 animate-spin" />
										Deleting...
									{:else}
										<Trash2 class="mr-2 h-4 w-4" />
										Delete Account
									{/if}
								</Button>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
