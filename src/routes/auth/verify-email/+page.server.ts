import { auth } from '$lib/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) {
		return { status: 'error', message: 'No token provided' };
	}

	try {
		// verifyEmail usually expects query params
		await auth.api.verifyEmail({
			query: {
				token
			}
		});

		return { status: 'success' };
	} catch (error: any) {
		const message = error.body?.message || error.message || 'An unexpected error occurred';
		return { status: 'error', message };
	}
};
