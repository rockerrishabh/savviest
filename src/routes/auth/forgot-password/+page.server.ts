import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { auth } from '$lib/auth';
import { forgotPasswordSchema, formatZodErrors } from '$lib/validations/auth';

// Define minimal generic interface for better-auth API methods used here
interface AuthApi {
	forgetPassword: (params: { body: { email: string; redirectTo: string } }) => Promise<void>;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		const validation = forgotPasswordSchema.safeParse({ email });

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
			await (auth.api as any).forgetPassword({
				body: {
					email,
					redirectTo: '/auth/reset-password'
				}
			});

			return {
				success: true,
				email
			};
		} catch (error: any) {
			const message = error.body?.message || error.message || 'An unexpected error occurred';
			return fail(500, {
				generalError: message,
				fields: { email }
			});
		}
	}
};
