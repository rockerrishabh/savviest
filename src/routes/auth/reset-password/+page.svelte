<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import Lock from '@lucide/svelte/icons/lock';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CheckCircle from '@lucide/svelte/icons/check-circle';

	let { form, data } = $props();
	// data.token is available if needed, but the form submits to the current URL which includes searchParams by default?
	// Actually, form action default is current URL including query params. So ?token=... persists.
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
			{#if form?.success}
				<Card.Content class="pt-6">
					<div class="flex flex-col items-center justify-center space-y-4 py-8 text-center">
						<div class="rounded-full bg-emerald-500/10 p-4">
							<CheckCircle class="h-12 w-12 text-emerald-500" />
						</div>
						<div class="space-y-2">
							<h3 class="text-xl font-semibold">Password Reset Complete</h3>
							<p class="text-muted-foreground">
								Your password has been successfully reset. <br />
								You can now sign in with your new password.
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
					<form method="POST" class="space-y-4">
						<!-- Token is passed via URL query param which form submission preserves by default if action is omitted -->
						{#if form?.generalError}
							<div
								class="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
							>
								{form.generalError}
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

						<Button type="submit" class="w-full">
							Reset Password
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</form>
				</Card.Content>
			{/if}
		</Card.Root>
	</div>
</div>
