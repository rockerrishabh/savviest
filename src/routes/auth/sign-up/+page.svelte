<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { signUpSchema, formatZodErrors } from '$lib/validations/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Mail from '@lucide/svelte/icons/mail';
	import Lock from '@lucide/svelte/icons/lock';
	import UserIcon from '@lucide/svelte/icons/user';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import { toast } from 'svelte-sonner';

	let signUpSuccess = $state(false);

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let terms = $state(false);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isLoading = $state(false);
	let isGoogleLoading = $state(false);
	let isGithubLoading = $state(false);
	let errors = $state<Record<string, string>>({});
	let generalError = $state('');

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
		const result = signUpSchema.safeParse({ name, email, password, confirmPassword, terms });
		if (!result.success) {
			errors = formatZodErrors(result.error);
			generalError = 'Please correct the errors below';
			return;
		}

		isLoading = true;

		try {
			await authClient.signUp.email(
				{
					name,
					email,
					password
				},
				{
					onSuccess: () => {
						toast.success('Signed up successfully');
						signUpSuccess = true;
					},
					onError: (err) => {
						generalError = err.error.message || 'Failed to create account';
					}
				}
			);
		} catch (err) {
			generalError = 'An unexpected error occurred. Please try again.';
		} finally {
			isLoading = false;
		}
	};

	// Resend verification email state
	let resendCountdown = $state(0);
	let isResending = $state(false);
	let countdownInterval: ReturnType<typeof setInterval> | null = null;

	const startCountdown = () => {
		resendCountdown = 30;
		if (countdownInterval) clearInterval(countdownInterval);
		countdownInterval = setInterval(() => {
			resendCountdown--;
			if (resendCountdown <= 0) {
				if (countdownInterval) clearInterval(countdownInterval);
				countdownInterval = null;
			}
		}, 1000);
	};

	const handleResendVerification = async () => {
		if (resendCountdown > 0 || isResending) return;

		isResending = true;
		try {
			await authClient.sendVerificationEmail(
				{ email },
				{
					onSuccess: () => {
						toast.success('Verification email sent!');
						startCountdown();
					},
					onError: (err) => {
						toast.error(err.error.message || 'Failed to send verification email');
					}
				}
			);
		} catch (err) {
			toast.error('An unexpected error occurred');
		} finally {
			isResending = false;
		}
	};

	// Start countdown on successful signup
	$effect(() => {
		if (signUpSuccess) {
			startCountdown();
		}
		return () => {
			if (countdownInterval) clearInterval(countdownInterval);
		};
	});

	const handleGoogleSignIn = async () => {
		isGoogleLoading = true;
		generalError = '';

		try {
			await authClient.signIn.social({
				provider: 'google',
				callbackURL: '/dashboard'
			});
		} catch (err) {
			generalError = 'Failed to continue with Google. Please try again.';
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
			generalError = 'Failed to continue with GitHub. Please try again.';
			isGithubLoading = false;
		}
	};
</script>

<svelte:head>
	<title>Sign Up | BlogSpace</title>
	<meta
		name="description"
		content="Create your BlogSpace account and start sharing your stories with the world. Join our community of writers today."
	/>
</svelte:head>

<div
	class="relative flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-muted/50 p-4"
>
	<!-- Background decoration -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<div class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-chart-2/10 blur-3xl"></div>
		<div class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
	</div>

	<div class="relative z-10 w-full max-w-md py-8">
		<!-- Logo/Brand -->
		<div class="mb-8 text-center">
			<div
				class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-chart-2 to-primary shadow-lg shadow-chart-2/25"
			>
				<Sparkles class="h-7 w-7 text-primary-foreground" />
			</div>
			<h1 class="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
			<p class="mt-2 text-muted-foreground">Join BlogSpace and start your journey</p>
		</div>

		{#if signUpSuccess}
			<!-- Success state with resend verification -->
			<Card.Root class="border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-xl">
				<Card.Content class="p-8">
					<div class="flex flex-col items-center justify-center space-y-4 py-4">
						<div class="rounded-full bg-emerald-500/10 p-4">
							<CheckCircle class="h-12 w-12 text-emerald-500" />
						</div>
						<div class="text-center">
							<h2 class="text-xl font-semibold text-foreground">Check your email</h2>
							<p class="mt-2 text-muted-foreground">
								We've sent a verification link to <span class="font-medium text-foreground"
									>{email}</span
								>
							</p>
						</div>

						<div class="w-full space-y-3 pt-4">
							<p class="text-center text-sm text-muted-foreground">
								Didn't receive the email? Check your spam folder or resend.
							</p>
							<Button
								class="w-full gap-2"
								variant="outline"
								disabled={resendCountdown > 0 || isResending}
								onclick={handleResendVerification}
							>
								{#if isResending}
									<Loader2 class="h-4 w-4 animate-spin" />
									Sending...
								{:else if resendCountdown > 0}
									<RefreshCw class="h-4 w-4" />
									Resend in {resendCountdown}s
								{:else}
									<RefreshCw class="h-4 w-4" />
									Resend verification email
								{/if}
							</Button>
						</div>
					</div>
				</Card.Content>
				<Card.Footer class="flex flex-col space-y-4 border-t border-border/50 pt-6">
					<p class="text-center text-sm text-muted-foreground">
						Already verified?
						<a href="/auth/sign-in" class="font-medium text-primary hover:underline"> Sign in </a>
					</p>
				</Card.Footer>
			</Card.Root>
		{:else}
			<Card.Root class="border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-xl">
				<Card.Header class="space-y-1 pb-4">
					<Card.Title class="text-xl">Sign up</Card.Title>
					<Card.Description>Fill in your details to create your account</Card.Description>
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
							<Label for="name">Full Name</Label>
							<div class="relative">
								<UserIcon
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									class="pl-10"
									bind:value={name}
									disabled={isLoading}
									aria-invalid={!!errors.name}
								/>
							</div>
							{#if errors.name}
								<p class="text-sm text-destructive">{errors.name}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="email">Email</Label>
							<div class="relative">
								<Mail
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="email"
									type="email"
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

						<div class="flex items-center space-x-3">
							<Checkbox
								id="terms"
								checked={terms}
								onCheckedChange={(checked) => (terms = checked === true)}
								disabled={isLoading}
								aria-invalid={!!errors.terms}
							/>
							<Label for="terms" class="text-sm leading-relaxed font-normal">
								I agree to the
								<a href="/terms" class="text-primary underline hover:text-primary/80">
									Terms of Service
								</a>
								and
								<a href="/privacy" class="text-primary underline hover:text-primary/80">
									Privacy Policy
								</a>
							</Label>
						</div>
						{#if errors.terms}
							<p class="text-sm text-destructive">{errors.terms}</p>
						{/if}

						<Button type="submit" class="w-full" disabled={isLoading}>
							{#if isLoading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								Creating account...
							{:else}
								Create account
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

					<!-- Social login buttons -->
					<div class="grid gap-3">
						<Button
							variant="outline"
							class="w-full"
							disabled={isLoading || isGoogleLoading || isGithubLoading}
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
							disabled={isLoading || isGoogleLoading || isGithubLoading}
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
						Already have an account?
						<a href="/auth/sign-in" class="font-medium text-primary hover:underline"> Sign in </a>
					</p>
				</Card.Footer>
			</Card.Root>
		{/if}
	</div>
</div>
