import { createAuthClient } from 'better-auth/svelte';
import { adminClient, twoFactorClient, oneTapClient } from 'better-auth/client/plugins';
import { passkeyClient } from '@better-auth/passkey/client';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

export const authClient = createAuthClient({
	plugins: [
		adminClient(),
		twoFactorClient(),
		passkeyClient(),
		oneTapClient({
			clientId: PUBLIC_GOOGLE_CLIENT_ID,
			autoSelect: false,
			cancelOnTapOutside: true,
			context: 'signin'
		})
	]
});
