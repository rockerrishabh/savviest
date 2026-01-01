<script lang="ts">
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Monitor from '@lucide/svelte/icons/monitor';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { setMode, resetMode } from 'mode-watcher';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" aria-label="Toggle theme">
				<Sun class="h-5 w-5 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
				<Moon
					class="absolute h-5 w-5 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => setMode('light')} class="cursor-pointer">
			<Sun class="mr-2 h-4 w-4" />
			<span>Light</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => setMode('dark')} class="cursor-pointer">
			<Moon class="mr-2 h-4 w-4" />
			<span>Dark</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => resetMode()} class="cursor-pointer">
			<Monitor class="mr-2 h-4 w-4" />
			<span>System</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
