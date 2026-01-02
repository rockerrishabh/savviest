import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/auth';
import { resetPasswordSchema, formatZodErrors } from '$lib/validations/auth';

interface AuthApi {
	resetPassword: (params: {
		body: { newPassword: string; token: string };
	}) => Promise<{ error?: { message: string } } | null>;
}

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) {
		throw redirect(303, '/auth/sign-in?error=missing_token');
	}
	return { token };
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		const token = url.searchParams.get('token');

		if (!token) {
			return fail(400, { generalError: 'Missing reset token' });
		}

		const validation = resetPasswordSchema.safeParse({ password, confirmPassword });

		if (!validation.success) {
			const flattened = validation.error.flatten().fieldErrors;
			const errors: Record<string, string> = {};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			for (const key in flattened) {
				if ((flattened as any)[key]?.[0]) {
					errors[key] = (flattened as any)[key]![0];
				}
			}
			return fail(400, {
				errors,
				passwordMatch: password !== confirmPassword
			});
		}

		try {
			const api = auth.api as unknown as AuthApi;
			const res = await api.resetPassword({
				body: {
					newPassword: password,
					token
				}
			});

			return {
				success: true
			};
		} catch (error: any) {
			const message = error.body?.message || error.message || 'An unexpected error occurred';
			return fail(500, {
				generalError: message
			});
		}
	}
};
