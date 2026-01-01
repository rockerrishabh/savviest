import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { isAdmin } from '$lib/types/roles';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		redirect(302, '/auth/sign-in');
	}

	// Check if user has admin role (from session)
	if (!isAdmin(locals.user.role)) {
		redirect(302, '/dashboard');
	}

	return {
		user: locals.user
	};
};
