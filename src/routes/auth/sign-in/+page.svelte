<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { signInSchema, formatZodErrors } from '$lib/validations/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Card from '$lib/components/ui/card';
	import Mail from '@lucide/svelte/icons/mail';
	import Lock from '@lucide/svelte/icons/lock';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Fingerprint from '@lucide/svelte/icons/fingerprint';
	import { toast } from 'svelte-sonner';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let rememberMe = $state(false);
	let isLoading = $state(false);
	let isPasskeyLoading = $state(false);
	let isGoogleLoading = $state(false);
	let isGithubLoading = $state(false);
	let errors = $state<Record<string, string>>({});
	let generalError = $state('');

	// Initialize authentication helpers on mount
	$effect(() => {
		// Initialize Google One Tap
		const initOneTap = async () => {
			try {
				await authClient.oneTap({
					fetchOptions: {
						onSuccess: async () => {
							await invalidateAll();
							toast.success('Signed in with Google!');
							goto('/dashboard');
						}
					}
				});
			} catch (error) {
				// Silently ignore - One Tap may be dismissed or not available
				console.debug('One Tap not completed:', error);
			}
		};

		// Initialize passkey conditional UI (autofill)
		const initConditionalUI = async () => {
			// Check if browser supports conditional UI
			if (!PublicKeyCredential.isConditionalMediationAvailable) {
				return;
			}

			const isAvailable = await PublicKeyCredential.isConditionalMediationAvailable();
			if (!isAvailable) {
				return;
			}

			// Preload passkeys for autofill
			try {
				await authClient.signIn.passkey({
					autoFill: true,
					fetchOptions: {
						onSuccess: async () => {
							await invalidateAll();
							toast.success('Signed in with passkey!');
							goto('/dashboard');
						}
					}
				});
			} catch (error) {
				// Silently ignore - user may not have passkeys or cancelled
				console.debug('Passkey autofill not completed:', error);
			}
		};

		// Run both initializations
		initOneTap();
		initConditionalUI();

		return () => {
			try {
				// @ts-ignore
				if (typeof google !== 'undefined' && google?.accounts?.id) {
					// @ts-ignore
					google.accounts.id.cancel();
				}
			} catch (e) {
				// ignore
			}
		};
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		errors = {};
		generalError = '';

		// Validate with Zod
		const result = signInSchema.safeParse({ email, password });
		if (!result.success) {
			errors = formatZodErrors(result.error);
			generalError = 'Please correct the errors below';
			return;
		}

		isLoading = true;

		try {
			await authClient.signIn.email(
				{
					email,
					password,
					rememberMe
				},
				{
					onError: (err) => {
						generalError = err.error.message || 'Invalid email or password';
					},
					onSuccess: async (context) => {
						if (context.data.twoFactorRedirect) {
							goto('/auth/verify-2fa?redirect=/dashboard');
						} else {
							await invalidateAll(); // Refresh user data from server
							toast.success('Signed in successfully');
							goto('/dashboard');
						}
					}
				}
			);
		} catch (err) {
			generalError = 'An unexpected error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	};

	const handlePasskeySignIn = async () => {
		isPasskeyLoading = true;
		generalError = '';

		try {
			const result = await authClient.signIn.passkey();

			if (result.error) {
				generalError = result.error.message || 'Passkey authentication failed';
				return;
			}

			await invalidateAll(); // Refresh user data from server
			toast.success('Signed in successfully with passkey!');
			goto('/dashboard');
		} catch (err) {
			generalError = 'Passkey authentication failed. Please try again.';
		} finally {
			isPasskeyLoading = false;
		}
	};

	const handleGoogleSignIn = async () => {
		isGoogleLoading = true;
		generalError = '';

		try {
			await authClient.signIn.social({
				provider: 'google',
				callbackURL: '/dashboard'
			});
		} catch (err) {
			generalError = 'Failed to sign in with Google. Please try again.';
			isGoogleLoading = false;
		}
	};

	const handleGithubSignIn = async () => {
		isGithubLoading = true;
		generalError = '';

		try {
			await authClient.signIn.social({
				provider: 'github',
				callbackURL: '/dashboard'
			});
		} catch (err) {
			generalError = 'Failed to sign in with GitHub. Please try again.';
			isGithubLoading = false;
		}
	};
</script>

<svelte:head>
	<title>Sign In | BlogSpace</title>
	<meta
		name="description"
		content="Sign in to your BlogSpace account to access your dashboard and create amazing blog posts."
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
			<h1 class="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
			<p class="mt-2 text-muted-foreground">Sign in to continue to BlogSpace</p>
		</div>

		<Card.Root class="border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-xl">
			<Card.Header class="space-y-1 pb-4">
				<Card.Title class="text-xl">Sign in</Card.Title>
				<Card.Description>Enter your credentials to access your account</Card.Description>
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
						<Label for="email">Email</Label>
						<div class="relative">
							<Mail
								class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								id="email"
								type="email"
								autocomplete="email webauthn"
								placeholder="name@example.com"
								class="pl-10"
								bind:value={email}
								disabled={isLoading}
								aria-invalid={!!errors.email}
							/>
						</div>
						{#if errors.email}
							<p class="text-sm text-destructive">{errors.email}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="password">Password</Label>
						<div class="relative">
							<Lock
								class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								autocomplete="current-password webauthn"
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
					</div>

					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<Checkbox id="remember" bind:checked={rememberMe} />
							<Label
								for="remember"
								class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Remember me
							</Label>
						</div>
						<a
							href="/auth/forgot-password"
							class="text-sm text-muted-foreground transition-colors hover:text-primary"
						>
							Forgot password?
						</a>
					</div>

					<Button type="submit" class="w-full" disabled={isLoading}>
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Signing in...
						{:else}
							Sign in
							<ArrowRight class="ml-2 h-4 w-4" />
						{/if}
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

				<!-- Alternative sign-in methods -->
				<div class="grid gap-3">
					<!-- Passkey sign-in -->
					<Button
						variant="outline"
						class="w-full"
						disabled={isLoading || isPasskeyLoading}
						onclick={handlePasskeySignIn}
					>
						{#if isPasskeyLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Authenticating...
						{:else}
							<Fingerprint class="mr-2 h-4 w-4" />
							Sign in with Passkey
						{/if}
					</Button>

					<!-- Social login buttons -->
					<Button
						variant="outline"
						class="w-full"
						disabled={isLoading || isPasskeyLoading || isGoogleLoading || isGithubLoading}
						onclick={handleGoogleSignIn}
					>
						{#if isGoogleLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Connecting...
						{:else}
							<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
							Continue with Google
						{/if}
					</Button>
					<Button
						variant="outline"
						class="w-full"
						disabled={isLoading || isPasskeyLoading || isGoogleLoading || isGithubLoading}
						onclick={handleGithubSignIn}
					>
						{#if isGithubLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Connecting...
						{:else}
							<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
							Continue with GitHub
						{/if}
					</Button>
				</div>
			</Card.Content>
			<Card.Footer class="flex flex-col space-y-4 border-t border-border/50 pt-6">
				<p class="text-center text-sm text-muted-foreground">
					Don't have an account?
					<a href="/auth/sign-up" class="font-medium text-primary hover:underline"> Sign up </a>
				</p>
			</Card.Footer>
		</Card.Root>

		<p class="mt-6 text-center text-xs text-muted-foreground">
			By continuing, you agree to our
			<a href="/terms" class="underline hover:text-foreground">Terms of Service</a>
			and
			<a href="/privacy" class="underline hover:text-foreground">Privacy Policy</a>.
		</p>
	</div>
</div>
