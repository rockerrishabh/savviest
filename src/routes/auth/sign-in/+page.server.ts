import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { auth } from '$lib/auth';
import { signInSchema, formatZodErrors } from '$lib/validations/auth';

interface AuthApi {
	signInEmail: (params: {
		body: { email: string; password: string };
	}) => Promise<{ user: any } | null>;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		// const rememberMe = formData.get('remember-me') === 'on';

		const validation = signInSchema.safeParse({ email, password });

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
				fields: { email }
			});
		}

		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const api = auth.api as unknown as AuthApi;
			const res = await api.signInEmail({
				body: {
					email,
					password
				}
			});
			// res contains the session/user object on success, or throws on failure (caught below)
			// But if better-auth does NOT throw and returns null?
			if (!res) {
				return fail(401, {
					generalError: 'Invalid email or password',
					fields: { email }
				});
			}
		} catch (error: any) {
			const message = error.body?.message || error.message || 'Invalid email or password';
			return fail(401, {
				generalError: message,
				fields: { email }
			});
		}

		throw redirect(303, '/dashboard');
	}
};
