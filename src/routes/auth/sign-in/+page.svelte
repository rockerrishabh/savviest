<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import Mail from '@lucide/svelte/icons/mail';
	import Lock from '@lucide/svelte/icons/lock';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	let { form } = $props();
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
				<form method="POST" class="space-y-4">
					{#if form?.generalError}
						<div
							class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
						>
							{form.generalError}
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
								name="email"
								type="email"
								autocomplete="email"
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
								autocomplete="current-password"
								placeholder="••••••••"
								class="pl-10"
								aria-invalid={!!form?.errors?.password}
							/>
						</div>
						{#if form?.errors?.password}
							<p class="text-sm text-destructive">{form.errors.password}</p>
						{/if}
					</div>

					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								id="remember-me"
								name="remember-me"
								class="h-4 w-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
							/>
							<Label
								for="remember-me"
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

					<Button type="submit" class="w-full">
						Sign in
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</form>
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
