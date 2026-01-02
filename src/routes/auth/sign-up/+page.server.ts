import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { auth } from '$lib/auth';
import { signUpSchema, formatZodErrors } from '$lib/validations/auth';

interface AuthApi {
	signUpEmail: (params: {
		body: { name: string; email: string; password: string };
	}) => Promise<{ user: any } | null>;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		const terms = formData.get('terms') === 'on';

		const validation = signUpSchema.safeParse({
			name,
			email,
			password,
			confirmPassword,
			terms
		});

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
				fields: { name, email }
			});
		}

		try {
			const api = auth.api as unknown as AuthApi;
			const res = await api.signUpEmail({
				body: {
					name,
					email,
					password
				}
			});

			if (!res) {
				return fail(400, {
					generalError: 'Failed to create account',
					fields: { name, email }
				});
			}

			// If email verification is enabled, we might want to show the success message
			// simpler to just return success: true and let the page render the success view
			return {
				success: true,
				email
			};
		} catch (error: any) {
			const message = error.body?.message || error.message || 'An unexpected error occurred';
			return fail(500, {
				generalError: message,
				fields: { name, email }
			});
		}
	}
};
