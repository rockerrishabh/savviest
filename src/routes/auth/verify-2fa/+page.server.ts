import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/auth';

interface AuthApi {
	verifyBackupCode: (params: {
		body: { code: string };
	}) => Promise<{ error?: { message: string } }>;
	verifyTotp: (params: {
		body: { code: string; trustDevice: boolean };
	}) => Promise<{ error?: { message: string } }>;
}

export const load: PageServerLoad = async ({ url }) => {
	const method = url.searchParams.get('method') === 'backup' ? 'backup' : 'totp';
	const redirectUrl = url.searchParams.get('redirect') || '/dashboard';
	return { method, redirectUrl };
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const code = formData.get('code') as string;
		const backupCode = formData.get('backupCode') as string;
		const trustDevice = formData.get('trustDevice') === 'on';
		const redirectUrl = url.searchParams.get('redirect') || '/dashboard';

		try {
			// Cast api to locally defined interface to avoid type errors
			const api = auth.api as unknown as AuthApi;

			if (backupCode) {
				const res = await api.verifyBackupCode({
					body: { code: backupCode }
				});
				if (res?.error) return fail(400, { error: res.error.message, backupCode });
			} else {
				const res = await api.verifyTotp({
					body: { code, trustDevice }
				});
				if (res?.error) return fail(400, { error: res.error.message, code });
			}
		} catch (e: any) {
			const message = e.body?.message || e.message || 'Verification failed';
			return fail(500, { error: message });
		}

		throw redirect(303, redirectUrl);
	}
};
