<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import Mail from '@lucide/svelte/icons/mail';
	import Lock from '@lucide/svelte/icons/lock';
	import UserIcon from '@lucide/svelte/icons/user';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import CheckCircle from '@lucide/svelte/icons/check-circle';

	let { form } = $props();
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

		{#if form?.success}
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
									>{form.email}</span
								>
							</p>
						</div>

						<div class="w-full space-y-3 pt-4">
							<p class="text-center text-sm text-muted-foreground">
								Didn't receive the email? Check your spam folder.
							</p>
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
					<form method="POST" class="space-y-4">
						{#if form?.generalError}
							<div
								class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
							>
								{form.generalError}
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
									name="name"
									type="text"
									placeholder="John Doe"
									class="pl-10"
									value={form?.fields?.name ?? ''}
									aria-invalid={!!form?.errors?.name}
								/>
							</div>
							{#if form?.errors?.name}
								<p class="text-sm text-destructive">{form.errors.name}</p>
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
									name="email"
									type="email"
									placeholder="name@example.com"
									class="pl-10"
									value={form?.fields?.email ?? ''}
									aria-invalid={!!form?.errors?.email}
								/>
							</div>
							{#if form?.errors?.email}
								<p class="text-sm text-destructive">{form.errors.email}</p>
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
									name="password"
									type="password"
									placeholder="••••••••"
									class="pl-10"
									aria-invalid={!!form?.errors?.password}
								/>
							</div>
							{#if form?.errors?.password}
								<p class="text-sm text-destructive">{form.errors.password}</p>
							{/if}
							<div class="px-1 text-xs text-muted-foreground">
								Password must be at least 8 characters and include uppercase, lowercase, and number.
							</div>
						</div>

						<div class="space-y-2">
							<Label for="confirmPassword">Confirm Password</Label>
							<div class="relative">
								<Lock
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									placeholder="••••••••"
									class="pl-10"
									aria-invalid={!!form?.errors?.confirmPassword}
								/>
							</div>
							{#if form?.errors?.confirmPassword}
								<p class="text-sm text-destructive">{form.errors.confirmPassword}</p>
							{/if}
						</div>

						<div class="flex items-center space-x-3">
							<input
								type="checkbox"
								id="terms"
								name="terms"
								class="h-4 w-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
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
						{#if form?.errors?.terms}
							<p class="text-sm text-destructive">{form.errors.terms}</p>
						{/if}

						<Button type="submit" class="w-full">
							Create account
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</form>

					<div class="relative my-6">
						<Separator />
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
