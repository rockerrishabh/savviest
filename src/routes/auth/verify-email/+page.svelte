<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import XCircle from '@lucide/svelte/icons/x-circle';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	let { data } = $props();
	// data.status is 'success' or 'error'
</script>

<svelte:head>
	<title>Verify Email | BlogSpace</title>
	<meta
		name="description"
		content="Verify your email address to complete your BlogSpace account registration."
	/>
</svelte:head>

<div
	class="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-linear-to-br from-background via-background to-muted/50 p-4"
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
			<h1 class="text-3xl font-bold tracking-tight text-foreground">Email Verification</h1>
		</div>

		<Card.Root class="border-border/50 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-xl">
			<Card.Content class="p-8">
				{#if data.status === 'success'}
					<div class="flex flex-col items-center justify-center space-y-4 py-8">
						<div class="rounded-full bg-emerald-500/10 p-4">
							<CheckCircle class="h-12 w-12 text-emerald-500" />
						</div>
						<div class="text-center">
							<h2 class="text-xl font-semibold text-foreground">Email Verified!</h2>
							<p class="mt-2 text-muted-foreground">
								Your email has been successfully verified. You can now sign in.
							</p>
						</div>
						<Button href="/auth/sign-in" class="mt-4">Continue to Sign In</Button>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center space-y-4 py-8">
						<div class="rounded-full bg-destructive/10 p-4">
							<XCircle class="h-12 w-12 text-destructive" />
						</div>
						<div class="text-center">
							<h2 class="text-xl font-semibold text-foreground">Verification Failed</h2>
							<p class="mt-2 text-muted-foreground">{data.message}</p>
						</div>
						<div class="mt-4 flex gap-3">
							<Button variant="outline" href="/">Go Home</Button>
							<Button href="/auth/sign-up">Sign Up Again</Button>
						</div>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
