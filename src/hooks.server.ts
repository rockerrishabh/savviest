import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { isAdmin } from '$lib/types/roles';

export async function handle({ event, resolve }) {
	// Fetch current session from Better Auth
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	// Make session and user available on server
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	// Redirect authenticated users away from auth pages (except verify-2fa which is part of login flow)
	const isVerify2FAPage = event.url.pathname === '/auth/verify-2fa';
	if (event.url.pathname.startsWith('/auth') && session && !isVerify2FAPage) {
		return redirect(302, '/dashboard');
	}

	// Protect dashboard routes - require authentication
	if (event.url.pathname.startsWith('/dashboard') && !session) {
		return redirect(302, '/auth/sign-in');
	}

	// Protect admin routes - require authentication and admin role
	if (event.url.pathname.startsWith('/admin')) {
		if (!session) {
			return redirect(302, '/auth/sign-in');
		}
		if (!isAdmin(session.user.role)) {
			return redirect(302, '/dashboard');
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
}
