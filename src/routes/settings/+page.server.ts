import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/auth';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		redirect(303, '/auth/sign-in?redirect=/settings');
	}

	return {};
};

export const actions: Actions = {
	setPassword: async ({ request }) => {
		const formData = await request.formData();
		const newPassword = formData.get('newPassword');

		if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters' });
		}

		try {
			await auth.api.setPassword({
				body: { newPassword },
				headers: request.headers
			});
			return { success: true };
		} catch (error) {
			console.error('Failed to set password:', error);
			return fail(500, { error: 'Failed to set password' });
		}
	}
};
