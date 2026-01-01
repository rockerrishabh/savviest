<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { authClient } from '$lib/auth-client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import Shield from '@lucide/svelte/icons/shield';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import XCircle from '@lucide/svelte/icons/x-circle';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Copy from '@lucide/svelte/icons/copy';
	import Download from '@lucide/svelte/icons/download';
	import QrCode from '@lucide/svelte/icons/qr-code';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

	interface Props {
		twoFactorEnabled?: boolean;
	}

	let { twoFactorEnabled = false }: Props = $props();

	// State
	let isDialogOpen = $state(false);
	let step = $state<'password' | 'qrcode' | 'verify' | 'backup' | 'disable'>('password');
	let isLoading = $state(false);

	// Form data
	let password = $state('');
	let totpCode = $state('');
	let totpUri = $state('');
	let backupCodes = $state<string[]>([]);

	// QR Code as data URL
	let qrCodeDataUrl = $state('');

	// Reset state when dialog closes
	const resetState = () => {
		step = twoFactorEnabled ? 'disable' : 'password';
		password = '';
		totpCode = '';
		totpUri = '';
		qrCodeDataUrl = '';
		backupCodes = [];
		isLoading = false;
	};

	// Generate QR code using a canvas approach
	const generateQRCode = async (uri: string) => {
		// Using a simple QR code approach with external library or API
		// For production, you'd want to use a library like qrcode
		try {
			const response = await fetch(
				`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`
			);
			if (response.ok) {
				const blob = await response.blob();
				qrCodeDataUrl = URL.createObjectURL(blob);
			}
		} catch (error) {
			console.error('Failed to generate QR code:', error);
		}
	};

	// Step 1: Enable 2FA with password
	const handleEnable2FA = async () => {
		if (!password) {
			toast.error('Please enter your password');
			return;
		}

		isLoading = true;
		try {
			const result = await authClient.twoFactor.enable({
				password
			});

			if (result.error) {
				toast.error(result.error.message || 'Failed to enable 2FA');
				return;
			}

			if (result.data) {
				totpUri = result.data.totpURI;
				backupCodes = result.data.backupCodes;
				await generateQRCode(totpUri);
				step = 'qrcode';
			}
		} catch (error) {
			toast.error('Failed to enable two-factor authentication');
		} finally {
			isLoading = false;
		}
	};

	// Step 2: Verify TOTP code
	const handleVerifyCode = async () => {
		if (!totpCode || totpCode.length !== 6) {
			toast.error('Please enter a valid 6-digit code');
			return;
		}

		isLoading = true;
		try {
			const result = await authClient.twoFactor.verifyTotp({
				code: totpCode
			});

			if (result.error) {
				toast.error(result.error.message || 'Invalid verification code');
				return;
			}

			step = 'backup';
			toast.success('Two-factor authentication verified!');
		} catch (error) {
			toast.error('Failed to verify code');
		} finally {
			isLoading = false;
		}
	};

	// Disable 2FA
	const handleDisable2FA = async () => {
		if (!password) {
			toast.error('Please enter your password');
			return;
		}

		isLoading = true;
		try {
			const result = await authClient.twoFactor.disable({
				password
			});

			if (result.error) {
				toast.error(result.error.message || 'Failed to disable 2FA');
				return;
			}

			toast.success('Two-factor authentication disabled');
			await invalidateAll();
			isDialogOpen = false;
			resetState();
		} catch (error) {
			toast.error('Failed to disable two-factor authentication');
		} finally {
			isLoading = false;
		}
	};

	// Complete setup
	const handleComplete = async () => {
		await invalidateAll();
		isDialogOpen = false;
		resetState();
		toast.success('Two-factor authentication is now active!');
	};

	// Copy backup codes
	const copyBackupCodes = () => {
		const codesText = backupCodes.join('\n');
		navigator.clipboard.writeText(codesText);
		toast.success('Backup codes copied to clipboard');
	};

	// Download backup codes
	const downloadBackupCodes = () => {
		const codesText = `BlogSpace Backup Codes\n${'='.repeat(30)}\n\nStore these codes in a safe place.\nEach code can only be used once.\n\n${backupCodes.join('\n')}\n\nGenerated: ${new Date().toISOString()}`;
		const blob = new Blob([codesText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'blogspace-backup-codes.txt';
		a.click();
		URL.revokeObjectURL(url);
		toast.success('Backup codes downloaded');
	};

	// Handle dialog open/close
	const handleOpenChange = (open: boolean) => {
		isDialogOpen = open;
		if (!open) {
			resetState();
		} else {
			step = twoFactorEnabled ? 'disable' : 'password';
		}
	};
</script>

<div class="flex items-center justify-between rounded-lg border border-border/50 p-4">
	<div class="flex items-center gap-4">
		<div
			class="flex h-12 w-12 items-center justify-center rounded-full {twoFactorEnabled
				? 'bg-emerald-500/10'
				: 'bg-amber-500/10'}"
		>
			{#if twoFactorEnabled}
				<CheckCircle class="h-6 w-6 text-emerald-500" />
			{:else}
				<XCircle class="h-6 w-6 text-amber-500" />
			{/if}
		</div>
		<div>
			<p class="font-medium">
				{twoFactorEnabled ? '2FA is enabled' : '2FA is not enabled'}
			</p>
			<p class="text-sm text-muted-foreground">
				{twoFactorEnabled
					? 'Your account is protected with 2FA'
					: 'Enable 2FA for additional security'}
			</p>
		</div>
	</div>

	<Dialog.Root open={isDialogOpen} onOpenChange={handleOpenChange}>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant={twoFactorEnabled ? 'outline' : 'default'}>
					{twoFactorEnabled ? 'Manage' : 'Enable'}
				</Button>
			{/snippet}
		</Dialog.Trigger>

		<Dialog.Content class="sm:max-w-md">
			{#if step === 'password'}
				<!-- Step 1: Enter Password to Enable -->
				<Dialog.Header>
					<Dialog.Title class="flex items-center gap-2">
						<Shield class="h-5 w-5 text-primary" />
						Enable Two-Factor Authentication
					</Dialog.Title>
					<Dialog.Description>
						Enter your password to start setting up two-factor authentication.
					</Dialog.Description>
				</Dialog.Header>

				<div class="space-y-4 py-4">
					<div class="space-y-2">
						<Label for="2fa-password">Password</Label>
						<Input
							id="2fa-password"
							type="password"
							bind:value={password}
							placeholder="Enter your password"
							onkeydown={(e) => e.key === 'Enter' && handleEnable2FA()}
						/>
					</div>
				</div>

				<Dialog.Footer>
					<Button variant="outline" onclick={() => (isDialogOpen = false)}>Cancel</Button>
					<Button onclick={handleEnable2FA} disabled={isLoading}>
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{:else}
							<Shield class="mr-2 h-4 w-4" />
						{/if}
						Continue
					</Button>
				</Dialog.Footer>
			{:else if step === 'qrcode'}
				<!-- Step 2: Scan QR Code -->
				<Dialog.Header>
					<Dialog.Title class="flex items-center gap-2">
						<QrCode class="h-5 w-5 text-primary" />
						Scan QR Code
					</Dialog.Title>
					<Dialog.Description>
						Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
					</Dialog.Description>
				</Dialog.Header>

				<div class="flex flex-col items-center gap-4 py-4">
					<!-- QR Code Display -->
					<div class="rounded-xl border-2 border-dashed border-border bg-white p-4">
						{#if qrCodeDataUrl}
							<img src={qrCodeDataUrl} alt="2FA QR Code" class="h-48 w-48" />
						{:else}
							<div class="flex h-48 w-48 items-center justify-center">
								<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						{/if}
					</div>

					<p class="text-center text-sm text-muted-foreground">
						Can't scan? Enter this code manually in your app:
					</p>

					<div class="w-full rounded-lg bg-muted/50 p-3">
						<code class="text-xs break-all text-foreground">
							{totpUri.split('secret=')[1]?.split('&')[0] || 'Loading...'}
						</code>
					</div>
				</div>

				<Dialog.Footer>
					<Button variant="outline" onclick={() => (step = 'password')}>Back</Button>
					<Button onclick={() => (step = 'verify')}>
						<Smartphone class="mr-2 h-4 w-4" />
						I've Scanned It
					</Button>
				</Dialog.Footer>
			{:else if step === 'verify'}
				<!-- Step 3: Verify TOTP Code -->
				<Dialog.Header>
					<Dialog.Title class="flex items-center gap-2">
						<KeyRound class="h-5 w-5 text-primary" />
						Verify Setup
					</Dialog.Title>
					<Dialog.Description>
						Enter the 6-digit code from your authenticator app to verify the setup.
					</Dialog.Description>
				</Dialog.Header>

				<div class="space-y-4 py-4">
					<div class="space-y-2">
						<Label for="totp-code">Verification Code</Label>
						<Input
							id="totp-code"
							type="text"
							inputmode="numeric"
							pattern="[0-9]*"
							maxlength={6}
							bind:value={totpCode}
							placeholder="000000"
							class="text-center font-mono text-2xl tracking-[0.5em]"
							onkeydown={(e) => e.key === 'Enter' && handleVerifyCode()}
						/>
						<p class="text-xs text-muted-foreground">
							Enter the 6-digit code shown in your authenticator app
						</p>
					</div>
				</div>

				<Dialog.Footer>
					<Button variant="outline" onclick={() => (step = 'qrcode')}>Back</Button>
					<Button onclick={handleVerifyCode} disabled={isLoading || totpCode.length !== 6}>
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{:else}
							<CheckCircle class="mr-2 h-4 w-4" />
						{/if}
						Verify
					</Button>
				</Dialog.Footer>
			{:else if step === 'backup'}
				<!-- Step 4: Backup Codes -->
				<Dialog.Header>
					<Dialog.Title class="flex items-center gap-2 text-emerald-500">
						<CheckCircle class="h-5 w-5" />
						2FA Enabled Successfully!
					</Dialog.Title>
					<Dialog.Description>
						Save these backup codes in a safe place. You can use them to access your account if you
						lose your authenticator device.
					</Dialog.Description>
				</Dialog.Header>

				<div class="space-y-4 py-4">
					<div
						class="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400"
					>
						<div class="flex items-start gap-2">
							<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
							<p><strong>Important:</strong> Each backup code can only be used once.</p>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-4">
						{#each backupCodes as code}
							<code class="rounded bg-background px-2 py-1 text-center font-mono text-sm">
								{code}
							</code>
						{/each}
					</div>

					<div class="flex gap-2">
						<Button variant="outline" class="flex-1" onclick={copyBackupCodes}>
							<Copy class="mr-2 h-4 w-4" />
							Copy
						</Button>
						<Button variant="outline" class="flex-1" onclick={downloadBackupCodes}>
							<Download class="mr-2 h-4 w-4" />
							Download
						</Button>
					</div>
				</div>

				<Dialog.Footer>
					<Button onclick={handleComplete} class="w-full">
						<CheckCircle class="mr-2 h-4 w-4" />
						I've Saved My Backup Codes
					</Button>
				</Dialog.Footer>
			{:else if step === 'disable'}
				<!-- Disable 2FA -->
				<Dialog.Header>
					<Dialog.Title class="flex items-center gap-2 text-destructive">
						<AlertTriangle class="h-5 w-5" />
						Disable Two-Factor Authentication
					</Dialog.Title>
					<Dialog.Description>
						Enter your password to disable two-factor authentication. This will make your account
						less secure.
					</Dialog.Description>
				</Dialog.Header>

				<div class="space-y-4 py-4">
					<div
						class="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
					>
						<p>
							<strong>Warning:</strong> Disabling 2FA will remove the extra security layer from your account.
						</p>
					</div>

					<div class="space-y-2">
						<Label for="disable-password">Password</Label>
						<Input
							id="disable-password"
							type="password"
							bind:value={password}
							placeholder="Enter your password"
							onkeydown={(e) => e.key === 'Enter' && handleDisable2FA()}
						/>
					</div>
				</div>

				<Dialog.Footer>
					<Button variant="outline" onclick={() => (isDialogOpen = false)}>Cancel</Button>
					<Button variant="destructive" onclick={handleDisable2FA} disabled={isLoading}>
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Disable 2FA
					</Button>
				</Dialog.Footer>
			{/if}
		</Dialog.Content>
	</Dialog.Root>
</div>
