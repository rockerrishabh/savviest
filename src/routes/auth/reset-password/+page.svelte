<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { resetPasswordSchema, formatZodErrors } from '$lib/validations/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import Lock from '@lucide/svelte/icons/lock';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import { toast } from 'svelte-sonner';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import { page } from '$app/state';

	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isLoading = $state(false);
	let isSuccess = $state(false);
	let errors = $state<Record<string, string>>({});
	let generalError = $state('');

	$effect(() => {
		if (!page.url.searchParams.get('token')) {
			toast.error('Invalid or missing reset token');
			goto('/');
		}
	});

	// Password strength indicators
	const passwordChecks = $derived({
		minLength: password.length >= 8,
		hasLower: /[a-z]/.test(password),
		hasUpper: /[A-Z]/.test(password),
		hasNumber: /[0-9]/.test(password)
	});

	const passwordStrength = $derived(Object.values(passwordChecks).filter(Boolean).length);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		errors = {};
		generalError = '';

		// Validate with Zod
		const result = resetPasswordSchema.safeParse({ password, confirmPassword });
		if (!result.success) {
			errors = formatZodErrors(result.error);
			return;
		}

		isLoading = true;

		try {
			const { error } = await authClient.resetPassword({
				newPassword: password,
				token: page.url.searchParams.get('token') || ''
			});

			if (error) {
				generalError = error.message || 'Failed to reset password';
			} else {
				isSuccess = true;
				toast.success('Password reset successfully!');
				setTimeout(() => {
					goto('/auth/sign-in');
				}, 2000);
			}
		} catch (err) {
			generalError = 'An unexpected error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	};
</script>

<svelte:head>
	<title>Reset Password | BlogSpace</title>
	<meta name="description" content="Reset your password for BlogSpace." />
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
			<h1 class="text-3xl font-bold tracking-tight text-foreground">Reset Password</h1>
			<p class="mt-2 text-muted-foreground">Enter your new password below.</p>
		</div>

		<Card.Root class="border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-xl">
			{#if isSuccess}
				<Card.Content class="pt-6">
					<div class="flex flex-col items-center justify-center space-y-4 py-8 text-center">
						<div class="rounded-full bg-emerald-500/10 p-4">
							<CheckCircle class="h-12 w-12 text-emerald-500" />
						</div>
						<div class="space-y-2">
							<h3 class="text-xl font-semibold">Password Reset Complete</h3>
							<p class="text-muted-foreground">
								Your password has been successfully reset. <br />
								Redirecting you to sign in...
							</p>
						</div>
						<div class="pt-4">
							<Button href="/auth/sign-in" class="gap-2">
								Sign in now
								<ArrowRight class="h-4 w-4" />
							</Button>
						</div>
					</div>
				</Card.Content>
			{:else}
				<Card.Header class="space-y-1 pb-4">
					<Card.Title class="text-xl">New Password</Card.Title>
					<Card.Description>Please create a strong password for your account.</Card.Description>
				</Card.Header>
				<Card.Content>
					<form onsubmit={handleSubmit} class="space-y-4">
						{#if generalError}
							<div
								class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
							>
								{generalError}
							</div>
						{/if}

						<div class="space-y-2">
							<Label for="password">New Password</Label>
							<div class="relative">
								<Lock
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									class="pr-10 pl-10"
									bind:value={password}
									disabled={isLoading}
									aria-invalid={!!errors.password}
								/>
								<button
									type="button"
									class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
									onclick={() => (showPassword = !showPassword)}
									aria-label={showPassword ? 'Hide password' : 'Show password'}
								>
									{#if showPassword}
										<EyeOff class="h-4 w-4" />
									{:else}
										<Eye class="h-4 w-4" />
									{/if}
								</button>
							</div>
							{#if errors.password}
								<p class="text-sm text-destructive">{errors.password}</p>
							{/if}

							<!-- Password strength indicator -->
							{#if password.length > 0}
								<div class="space-y-2">
									<div class="flex gap-1">
										{#each Array(4) as _, i}
											<div
												class="h-1 flex-1 rounded-full transition-colors {i < passwordStrength
													? passwordStrength <= 1
														? 'bg-destructive'
														: passwordStrength <= 2
															? 'bg-orange-500'
															: passwordStrength <= 3
																? 'bg-yellow-500'
																: 'bg-green-500'
													: 'bg-muted'}"
											></div>
										{/each}
									</div>
									<div class="grid grid-cols-2 gap-1 text-xs">
										<div
											class="flex items-center gap-1 {passwordChecks.minLength
												? 'text-green-500'
												: 'text-muted-foreground'}"
										>
											{#if passwordChecks.minLength}
												<Check class="h-3 w-3" />
											{:else}
												<X class="h-3 w-3" />
											{/if}
											8+ characters
										</div>
										<div
											class="flex items-center gap-1 {passwordChecks.hasLower
												? 'text-green-500'
												: 'text-muted-foreground'}"
										>
											{#if passwordChecks.hasLower}
												<Check class="h-3 w-3" />
											{:else}
												<X class="h-3 w-3" />
											{/if}
											Lowercase
										</div>
										<div
											class="flex items-center gap-1 {passwordChecks.hasUpper
												? 'text-green-500'
												: 'text-muted-foreground'}"
										>
											{#if passwordChecks.hasUpper}
												<Check class="h-3 w-3" />
											{:else}
												<X class="h-3 w-3" />
											{/if}
											Uppercase
										</div>
										<div
											class="flex items-center gap-1 {passwordChecks.hasNumber
												? 'text-green-500'
												: 'text-muted-foreground'}"
										>
											{#if passwordChecks.hasNumber}
												<Check class="h-3 w-3" />
											{:else}
												<X class="h-3 w-3" />
											{/if}
											Number
										</div>
									</div>
								</div>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="confirmPassword">Confirm Password</Label>
							<div class="relative">
								<Lock
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder="••••••••"
									class="pr-10 pl-10"
									bind:value={confirmPassword}
									disabled={isLoading}
									aria-invalid={!!errors.confirmPassword}
								/>
								<button
									type="button"
									class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
									onclick={() => (showConfirmPassword = !showConfirmPassword)}
									aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
								>
									{#if showConfirmPassword}
										<EyeOff class="h-4 w-4" />
									{:else}
										<Eye class="h-4 w-4" />
									{/if}
								</button>
							</div>
							{#if errors.confirmPassword}
								<p class="text-sm text-destructive">{errors.confirmPassword}</p>
							{/if}
						</div>

						<Button type="submit" class="w-full" disabled={isLoading}>
							{#if isLoading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								Resetting Password...
							{:else}
								Reset Password
								<ArrowRight class="ml-2 h-4 w-4" />
							{/if}
						</Button>
					</form>
				</Card.Content>
			{/if}
		</Card.Root>
	</div>
</div>
