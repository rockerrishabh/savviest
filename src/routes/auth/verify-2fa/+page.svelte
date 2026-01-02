<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Shield from '@lucide/svelte/icons/shield';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';

	let { data, form } = $props();
	// data.method is 'totp' or 'backup'
</script>

<svelte:head>
	<title>Two-Factor Verification | BlogSpace</title>
	<meta
		name="description"
		content="Enter your two-factor authentication code to complete sign in."
	/>
</svelte:head>

<div
	class="relative flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-muted/50 p-4"
>
	<!-- Background decoration -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<div class="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
		<div class="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-chart-2/10 blur-3xl"></div>
	</div>

	<div class="relative z-10 w-full max-w-md">
		<!-- Logo/Brand -->
		<div class="mb-8 text-center">
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-chart-2 shadow-lg shadow-primary/25"
			>
				<Sparkles class="h-7 w-7 text-primary-foreground" />
			</div>
			<h1 class="text-3xl font-bold tracking-tight text-foreground">Two-Factor Verification</h1>
			<p class="mt-2 text-muted-foreground">One more step to secure your account</p>
		</div>

		<Card.Root class="border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-xl">
			<Card.Header class="space-y-1 pb-4">
				<div class="flex items-center gap-2">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<Shield class="h-5 w-5 text-primary" />
					</div>
					<div>
						<Card.Title class="text-xl">Verify your identity</Card.Title>
						<Card.Description>
							{data.method === 'backup'
								? 'Enter one of your backup codes'
								: 'Enter the code from your authenticator app'}
						</Card.Description>
					</div>
				</div>
			</Card.Header>

			<Card.Content>
				<form method="POST" class="space-y-4">
					{#if form?.error}
						<div
							class="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
						>
							<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
							<span>{form.error}</span>
						</div>
					{/if}

					{#if data.method === 'backup'}
						<!-- Backup Code Input -->
						<div class="space-y-2">
							<Label for="backupCode">Backup Code</Label>
							<div class="relative">
								<KeyRound
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="backupCode"
									name="backupCode"
									type="text"
									placeholder="Enter backup code"
									class="pl-10 font-mono"
									value={form ? (form as any).backupCode : ''}
								/>
							</div>
							<p class="text-xs text-muted-foreground">
								Backup codes are single-use. Once used, it cannot be used again.
							</p>
						</div>
					{:else}
						<!-- TOTP Code Input -->
						<div class="space-y-2">
							<Label for="code">Authentication Code</Label>
							<div class="relative">
								<Smartphone
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="code"
									name="code"
									type="text"
									inputmode="numeric"
									placeholder="000000"
									class="pl-10 text-center font-mono text-xl tracking-[0.3em]"
									maxlength={6}
									value={form ? (form as any).code : ''}
								/>
							</div>
							<p class="text-xs text-muted-foreground">
								Open your authenticator app and enter the 6-digit code
							</p>
						</div>

						<!-- Trust Device -->
						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								id="trustDevice"
								name="trustDevice"
								class="h-4 w-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
							/>
							<Label
								for="trustDevice"
								class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Trust this device for 30 days
							</Label>
						</div>
					{/if}

					<Button type="submit" class="w-full">
						Verify
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</form>

				<div class="relative my-6">
					<Separator />
					<span
						class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground"
					>
						OR
					</span>
				</div>

				<!-- Toggle between TOTP and Backup Code using Links -->
				<Button
					variant="outline"
					class="w-full"
					href={data.method === 'backup' ? '?method=totp' : '?method=backup'}
				>
					<KeyRound class="mr-2 h-4 w-4" />
					{data.method === 'backup' ? 'Use authenticator app instead' : 'Use a backup code instead'}
				</Button>
			</Card.Content>

			<Card.Footer class="flex flex-col space-y-4 border-t border-border/50 pt-6">
				<Button variant="ghost" href="/auth/sign-in" class="w-full">
					<ArrowLeft class="mr-2 h-4 w-4" />
					Back to sign in
				</Button>
			</Card.Footer>
		</Card.Root>

		<p class="mt-6 text-center text-xs text-muted-foreground">
			Lost access to your authenticator?
			<a href="/auth/forgot-password" class="underline hover:text-foreground">
				Reset your account
			</a>
		</p>
	</div>
</div>
