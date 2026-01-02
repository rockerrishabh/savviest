<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import Mail from '@lucide/svelte/icons/mail';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import CheckCircle from '@lucide/svelte/icons/check-circle';

	let { form } = $props();
</script>

<svelte:head>
	<title>Forgot Password | BlogSpace</title>
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
			<h1 class="text-3xl font-bold tracking-tight text-foreground">Forgot Password?</h1>
			<p class="mt-2 text-muted-foreground">Don't worry, we'll help you reset it.</p>
		</div>

		<Card.Root class="border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-xl">
			{#if form?.success}
				<Card.Content class="pt-6">
					<div class="flex flex-col items-center justify-center space-y-4 py-8 text-center">
						<div class="rounded-full bg-emerald-500/10 p-4">
							<CheckCircle class="h-12 w-12 text-emerald-500" />
						</div>
						<div class="space-y-2">
							<h3 class="text-xl font-semibold">Check your email</h3>
							<p class="text-muted-foreground">
								We have sent a password reset link to <br />
								<span class="font-medium text-foreground">{form.email}</span>
							</p>
						</div>
						<div class="pt-4">
							<Button variant="outline" href="/auth/sign-in" class="gap-2">
								<ArrowLeft class="h-4 w-4" />
								Back to Sign in
							</Button>
						</div>
					</div>
				</Card.Content>
			{:else}
				<Card.Header class="space-y-1 pb-4">
					<Card.Title class="text-xl">Reset Password</Card.Title>
					<Card.Description
						>Enter your email address and we'll send you a link to reset your password.</Card.Description
					>
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

						<Button type="submit" class="w-full">
							Send Reset Link
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</form>
				</Card.Content>
				<Card.Footer class="flex justify-center border-t border-border/50 pt-6">
					<a
						href="/auth/sign-in"
						class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						<ArrowLeft class="h-4 w-4" />
						Back to Sign in
					</a>
				</Card.Footer>
			{/if}
		</Card.Root>
	</div>
</div>
