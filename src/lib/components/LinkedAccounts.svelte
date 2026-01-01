<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import Link from '@lucide/svelte/icons/link';
	import Unlink from '@lucide/svelte/icons/unlink';
	import Plus from '@lucide/svelte/icons/plus';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Mail from '@lucide/svelte/icons/mail';
	import Shield from '@lucide/svelte/icons/shield';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import CheckCircle from '@lucide/svelte/icons/check-circle';

	interface LinkedAccount {
		id: string;
		providerId: string;
		accountId: string;
		createdAt: Date;
	}

	// State
	let linkedAccounts = $state<LinkedAccount[]>([]);
	let isLoading = $state(true);
	let isLinking = $state<string | null>(null);
	let isUnlinking = $state<string | null>(null);

	// Dialog state
	let isUnlinkDialogOpen = $state(false);
	let selectedAccount = $state<LinkedAccount | null>(null);

	// Available providers
	const providers = [
		{
			id: 'google',
			name: 'Google',
			icon: GoogleIcon,
			color: 'bg-red-500/10 text-red-600'
		},
		{
			id: 'github',
			name: 'GitHub',
			icon: GitHubIcon,
			color: 'bg-gray-500/10 text-gray-600 dark:text-gray-300'
		}
	];

	// Fetch linked accounts on mount
	$effect(() => {
		fetchLinkedAccounts();
	});

	export const refresh = async () => {
		await fetchLinkedAccounts();
	};

	const fetchLinkedAccounts = async () => {
		isLoading = true;
		try {
			const result = await authClient.listAccounts();
			if (result.data) {
				linkedAccounts = result.data;
			}
		} catch (error) {
			console.error('Failed to fetch linked accounts:', error);
		} finally {
			isLoading = false;
		}
	};

	const handleLinkAccount = async (providerId: string) => {
		isLinking = providerId;
		try {
			await authClient.linkSocial({
				provider: providerId as 'google' | 'github',
				callbackURL: window.location.href
			});
		} catch (error) {
			toast.error(`Failed to link ${providerId} account`);
			isLinking = null;
		}
	};

	const handleUnlinkAccount = async () => {
		if (!selectedAccount) return;

		// Check if this is the only account
		if (linkedAccounts.length <= 1) {
			toast.error('Cannot unlink your only authentication method');
			isUnlinkDialogOpen = false;
			return;
		}

		isUnlinking = selectedAccount.id;
		try {
			const result = await authClient.unlinkAccount({
				providerId: selectedAccount.providerId,
				accountId: selectedAccount.accountId
			});

			if (result.error) {
				toast.error(result.error.message || 'Failed to unlink account');
				return;
			}

			toast.success('Account unlinked successfully');
			isUnlinkDialogOpen = false;
			selectedAccount = null;
			await fetchLinkedAccounts();
			await invalidateAll();
		} catch (error) {
			toast.error('Failed to unlink account');
		} finally {
			isUnlinking = null;
		}
	};

	const openUnlinkDialog = (account: LinkedAccount) => {
		selectedAccount = account;
		isUnlinkDialogOpen = true;
	};

	const getProviderInfo = (providerId: string) => {
		return providers.find((p) => p.id === providerId) || null;
	};

	const isProviderLinked = (providerId: string) => {
		return linkedAccounts.some((a) => a.providerId === providerId);
	};

	// Derived state for email account
	const hasEmailAccount = $derived(linkedAccounts.some((a) => a.providerId === 'credential'));

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(new Date(date));
	};
</script>

<!-- Provider Icons -->
{#snippet GoogleIcon()}
	<svg class="h-5 w-5" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
		/>
		<path
			fill="currentColor"
			d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
		/>
		<path
			fill="currentColor"
			d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
		/>
		<path
			fill="currentColor"
			d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
		/>
	</svg>
{/snippet}

{#snippet GitHubIcon()}
	<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
		<path
			d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
		/>
	</svg>
{/snippet}

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h3 class="text-lg font-semibold text-foreground">Linked Accounts</h3>
		<p class="text-sm text-muted-foreground">
			Connect your accounts to enable multiple sign-in options
		</p>
	</div>

	<!-- Linked Accounts List -->
	{#if isLoading}
		<div class="flex items-center justify-center py-8">
			<Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
		</div>
	{:else}
		<div class="space-y-3">
			{#each providers as provider}
				{@const isLinked = isProviderLinked(provider.id)}
				{@const linkedAccount = linkedAccounts.find((a) => a.providerId === provider.id)}

				<div
					class="group flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-border hover:shadow-sm"
				>
					<div class="flex items-center gap-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full {provider.color}">
							{@render provider.icon()}
						</div>
						<div>
							<div class="flex items-center gap-2">
								<p class="font-medium text-foreground">{provider.name}</p>
								{#if isLinked}
									<span
										class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600"
									>
										<CheckCircle class="h-3 w-3" />
										Connected
									</span>
								{/if}
							</div>
							{#if isLinked && linkedAccount}
								<p class="text-xs text-muted-foreground">
									Linked on {formatDate(linkedAccount.createdAt)}
								</p>
							{:else}
								<p class="text-xs text-muted-foreground">Not connected</p>
							{/if}
						</div>
					</div>

					<div class="flex items-center gap-2">
						{#if isLinked}
							<Button
								variant="outline"
								size="sm"
								onclick={() => linkedAccount && openUnlinkDialog(linkedAccount)}
								disabled={linkedAccounts.length <= 1}
								class="text-destructive hover:text-destructive"
							>
								<Unlink class="mr-2 h-4 w-4" />
								Unlink
							</Button>
						{:else}
							<Button
								variant="outline"
								size="sm"
								onclick={() => handleLinkAccount(provider.id)}
								disabled={isLinking !== null}
							>
								{#if isLinking === provider.id}
									<Loader2 class="mr-2 h-4 w-4 animate-spin" />
									Connecting...
								{:else}
									<Link class="mr-2 h-4 w-4" />
									Connect
								{/if}
							</Button>
						{/if}
					</div>
				</div>
			{/each}

			<!-- Email/Password Account -->
			<div
				class="group flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-border hover:shadow-sm"
			>
				<div class="flex items-center gap-4">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<Mail class="h-5 w-5 text-primary" />
					</div>
					<div>
						<div class="flex items-center gap-2">
							<p class="font-medium text-foreground">Email & Password</p>
							{#if hasEmailAccount}
								<span
									class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600"
								>
									<CheckCircle class="h-3 w-3" />
									Connected
								</span>
							{/if}
						</div>
						<p class="text-xs text-muted-foreground">
							{hasEmailAccount ? 'Primary authentication method' : 'Not set up'}
						</p>
					</div>
				</div>

				{#if !hasEmailAccount}
					<Button variant="outline" size="sm" href="/settings">
						<Plus class="mr-2 h-4 w-4" />
						Set up
					</Button>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Info Section -->
	<div class="rounded-lg border border-border/50 bg-muted/30 p-4">
		<div class="flex items-start gap-3">
			<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
				<Shield class="h-4 w-4 text-primary" />
			</div>
			<div>
				<p class="text-sm font-medium text-foreground">Why link accounts?</p>
				<p class="mt-1 text-sm text-muted-foreground">
					Linking multiple accounts gives you more ways to sign in. You can use any connected method
					to access your account, making it easier if you forget your password or lose access to one
					method.
				</p>
			</div>
		</div>
	</div>
</div>

<!-- Unlink Confirmation Dialog -->
<Dialog.Root bind:open={isUnlinkDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-destructive">
				<AlertTriangle class="h-5 w-5" />
				Unlink Account
			</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to unlink your {getProviderInfo(selectedAccount?.providerId || '')
					?.name || 'account'}? You won't be able to sign in with this method anymore.
			</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer>
			<Button
				variant="outline"
				onclick={() => {
					isUnlinkDialogOpen = false;
					selectedAccount = null;
				}}
			>
				Cancel
			</Button>
			<Button variant="destructive" onclick={handleUnlinkAccount} disabled={isUnlinking !== null}>
				{#if isUnlinking}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Unlinking...
				{:else}
					<Unlink class="mr-2 h-4 w-4" />
					Unlink Account
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
