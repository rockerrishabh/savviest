import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { auth } from '$lib/auth';

export const actions: Actions = {
	default: async (event) => {
		try {
			await auth.api.signOut({
				headers: event.request.headers
			});
		} catch (e) {
			console.error('Sign out failed', e);
		}
		throw redirect(303, '/auth/sign-in');
	}
};
