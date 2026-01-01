<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import Fingerprint from '@lucide/svelte/icons/fingerprint';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Edit from '@lucide/svelte/icons/edit';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import Monitor from '@lucide/svelte/icons/monitor';
	import Shield from '@lucide/svelte/icons/shield';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import Clock from '@lucide/svelte/icons/clock';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

	interface Passkey {
		id: string;
		name?: string | undefined;
		credentialID: string;
		deviceType: string;
		backedUp: boolean;
		createdAt: Date | null;
	}

	// State
	let passkeys = $state<Passkey[]>([]);
	let isLoading = $state(true);
	let isAddingPasskey = $state(false);
	let isDeletingPasskey = $state<string | null>(null);
	let isEditingPasskey = $state<string | null>(null);

	// Dialog state
	let isAddDialogOpen = $state(false);
	let isDeleteDialogOpen = $state(false);
	let isEditDialogOpen = $state(false);
	let selectedPasskey = $state<Passkey | null>(null);

	// Form state
	let newPasskeyName = $state('');
	let editPasskeyName = $state('');
	let authenticatorType = $state<'platform' | 'cross-platform' | undefined>(undefined);

	// Fetch passkeys on mount
	$effect(() => {
		fetchPasskeys();
	});

	const fetchPasskeys = async () => {
		isLoading = true;
		try {
			const result = await authClient.passkey.listUserPasskeys();
			if (result.data) {
				passkeys = result.data;
			}
		} catch (error) {
			console.error('Failed to fetch passkeys:', error);
		} finally {
			isLoading = false;
		}
	};

	const handleAddPasskey = async () => {
		isAddingPasskey = true;
		try {
			const result = await authClient.passkey.addPasskey({
				name: newPasskeyName || undefined,
				authenticatorAttachment: authenticatorType
			});

			if (result.error) {
				toast.error(result.error.message || 'Failed to add passkey');
				return;
			}

			toast.success('Passkey added successfully!');
			isAddDialogOpen = false;
			newPasskeyName = '';
			authenticatorType = undefined;
			await fetchPasskeys();
		} catch (error) {
			toast.error('Failed to add passkey. Please try again.');
		} finally {
			isAddingPasskey = false;
		}
	};

	const handleDeletePasskey = async () => {
		if (!selectedPasskey) return;

		isDeletingPasskey = selectedPasskey.id;
		try {
			const result = await authClient.passkey.deletePasskey({
				id: selectedPasskey.id
			});

			if (result.error) {
				toast.error(result.error.message || 'Failed to delete passkey');
				return;
			}

			toast.success('Passkey deleted successfully');
			isDeleteDialogOpen = false;
			selectedPasskey = null;
			await fetchPasskeys();
		} catch (error) {
			toast.error('Failed to delete passkey');
		} finally {
			isDeletingPasskey = null;
		}
	};

	const handleUpdatePasskey = async () => {
		if (!selectedPasskey || !editPasskeyName.trim()) return;

		isEditingPasskey = selectedPasskey.id;
		try {
			const result = await authClient.passkey.updatePasskey({
				id: selectedPasskey.id,
				name: editPasskeyName
			});

			if (result.error) {
				toast.error(result.error.message || 'Failed to update passkey');
				return;
			}

			toast.success('Passkey updated successfully');
			isEditDialogOpen = false;
			selectedPasskey = null;
			editPasskeyName = '';
			await fetchPasskeys();
		} catch (error) {
			toast.error('Failed to update passkey');
		} finally {
			isEditingPasskey = null;
		}
	};

	const openDeleteDialog = (passkey: Passkey) => {
		selectedPasskey = passkey;
		isDeleteDialogOpen = true;
	};

	const openEditDialog = (passkey: Passkey) => {
		selectedPasskey = passkey;
		editPasskeyName = passkey.name || '';
		isEditDialogOpen = true;
	};

	const formatDate = (date: Date | null) => {
		if (!date) return 'Unknown';
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date);
	};

	const getDeviceIcon = (deviceType: string) => {
		switch (deviceType.toLowerCase()) {
			case 'platform':
				return Monitor;
			case 'cross-platform':
				return KeyRound;
			default:
				return Fingerprint;
		}
	};
</script>

<div class="space-y-6">
	<!-- Header with Add button -->
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold text-foreground">Passkeys</h3>
			<p class="text-sm text-muted-foreground">
				Manage your passkeys for passwordless authentication
			</p>
		</div>
		<Dialog.Root bind:open={isAddDialogOpen}>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button {...props} size="sm">
						<Plus class="mr-2 h-4 w-4" />
						Add Passkey
					</Button>
				{/snippet}
			</Dialog.Trigger>

			<Dialog.Content class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title class="flex items-center gap-2">
						<Fingerprint class="h-5 w-5 text-primary" />
						Add New Passkey
					</Dialog.Title>
					<Dialog.Description>
						Register a new passkey for secure, passwordless sign-in.
					</Dialog.Description>
				</Dialog.Header>

				<div class="space-y-4 py-4">
					<div class="space-y-2">
						<Label for="passkey-name">Passkey Name (optional)</Label>
						<Input
							id="passkey-name"
							type="text"
							bind:value={newPasskeyName}
							placeholder="e.g., MacBook Pro, iPhone"
						/>
						<p class="text-xs text-muted-foreground">
							Give your passkey a name to identify it later
						</p>
					</div>

					<div class="space-y-2">
						<Label>Authenticator Type</Label>
						<div class="grid grid-cols-2 gap-3">
							<button
								type="button"
								class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all {authenticatorType ===
									'platform' || authenticatorType === undefined
									? 'border-primary bg-primary/5'
									: 'border-border/50 hover:border-border'}"
								onclick={() => (authenticatorType = 'platform')}
							>
								<Monitor class="h-6 w-6 text-primary" />
								<span class="text-sm font-medium">This Device</span>
								<span class="text-xs text-muted-foreground">Face ID, Touch ID</span>
							</button>
							<button
								type="button"
								class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all {authenticatorType ===
								'cross-platform'
									? 'border-primary bg-primary/5'
									: 'border-border/50 hover:border-border'}"
								onclick={() => (authenticatorType = 'cross-platform')}
							>
								<KeyRound class="h-6 w-6 text-primary" />
								<span class="text-sm font-medium">Security Key</span>
								<span class="text-xs text-muted-foreground">USB, NFC, Bluetooth</span>
							</button>
						</div>
					</div>
				</div>

				<Dialog.Footer>
					<Button variant="outline" onclick={() => (isAddDialogOpen = false)}>Cancel</Button>
					<Button onclick={handleAddPasskey} disabled={isAddingPasskey}>
						{#if isAddingPasskey}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Registering...
						{:else}
							<Fingerprint class="mr-2 h-4 w-4" />
							Register Passkey
						{/if}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<!-- Passkeys List -->
	{#if isLoading}
		<div class="flex items-center justify-center py-8">
			<Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
		</div>
	{:else if passkeys.length === 0}
		<div class="rounded-lg border-2 border-dashed border-border/50 bg-muted/20 p-8 text-center">
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
			>
				<Fingerprint class="h-6 w-6 text-primary" />
			</div>
			<h4 class="font-medium text-foreground">No passkeys registered</h4>
			<p class="mt-1 text-sm text-muted-foreground">
				Add a passkey to sign in without a password using biometrics or a security key.
			</p>
			<Button class="mt-4" onclick={() => (isAddDialogOpen = true)}>
				<Plus class="mr-2 h-4 w-4" />
				Add Your First Passkey
			</Button>
		</div>
	{:else}
		<div class="space-y-3">
			{#each passkeys as passkey}
				{@const DeviceIcon = getDeviceIcon(passkey.deviceType)}
				<div
					class="group flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-border hover:shadow-sm"
				>
					<div class="flex items-center gap-4">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
						>
							<DeviceIcon class="h-5 w-5" />
						</div>
						<div>
							<div class="flex items-center gap-2">
								<p class="font-medium text-foreground">
									{passkey.name || 'Unnamed Passkey'}
								</p>
								{#if passkey.backedUp}
									<span
										class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600"
									>
										<Shield class="h-3 w-3" />
										Backed up
									</span>
								{/if}
							</div>
							<div class="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
								<span class="capitalize">{passkey.deviceType} authenticator</span>
								<span class="flex items-center gap-1">
									<Clock class="h-3 w-3" />
									Added {formatDate(passkey.createdAt)}
								</span>
							</div>
						</div>
					</div>

					<div class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
						<Button
							variant="ghost"
							size="icon"
							onclick={() => openEditDialog(passkey)}
							class="h-8 w-8"
						>
							<Edit class="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onclick={() => openDeleteDialog(passkey)}
							class="h-8 w-8 text-destructive hover:text-destructive"
						>
							<Trash2 class="h-4 w-4" />
						</Button>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Info Section -->
	<div class="rounded-lg border border-border/50 bg-muted/30 p-4">
		<div class="flex items-start gap-3">
			<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
				<Shield class="h-4 w-4 text-primary" />
			</div>
			<div>
				<p class="text-sm font-medium text-foreground">Why use passkeys?</p>
				<p class="mt-1 text-sm text-muted-foreground">
					Passkeys are more secure than passwords. They use biometrics or security keys and are
					resistant to phishing attacks. You can sign in quickly across all your devices.
				</p>
			</div>
		</div>
	</div>
</div>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={isDeleteDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-destructive">
				<AlertTriangle class="h-5 w-5" />
				Delete Passkey
			</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete "{selectedPasskey?.name || 'this passkey'}"? This action
				cannot be undone.
			</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer>
			<Button
				variant="outline"
				onclick={() => {
					isDeleteDialogOpen = false;
					selectedPasskey = null;
				}}
			>
				Cancel
			</Button>
			<Button
				variant="destructive"
				onclick={handleDeletePasskey}
				disabled={isDeletingPasskey !== null}
			>
				{#if isDeletingPasskey}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Deleting...
				{:else}
					<Trash2 class="mr-2 h-4 w-4" />
					Delete Passkey
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Edit Passkey Dialog -->
<Dialog.Root bind:open={isEditDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Edit class="h-5 w-5 text-primary" />
				Rename Passkey
			</Dialog.Title>
			<Dialog.Description>Give your passkey a new name to identify it.</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="edit-passkey-name">Passkey Name</Label>
				<Input
					id="edit-passkey-name"
					type="text"
					bind:value={editPasskeyName}
					placeholder="e.g., MacBook Pro, iPhone"
				/>
			</div>
		</div>

		<Dialog.Footer>
			<Button
				variant="outline"
				onclick={() => {
					isEditDialogOpen = false;
					selectedPasskey = null;
					editPasskeyName = '';
				}}
			>
				Cancel
			</Button>
			<Button
				onclick={handleUpdatePasskey}
				disabled={isEditingPasskey !== null || !editPasskeyName.trim()}
			>
				{#if isEditingPasskey}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Saving...
				{:else}
					<CheckCircle class="mr-2 h-4 w-4" />
					Save Changes
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
