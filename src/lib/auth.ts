import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './server/db';
import { admin, twoFactor, oneTap } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { validatedEnv } from '$lib/server/env';
import { sendMail } from '$lib/server/mail';
import { getVerificationEmailTemplate } from '$lib/server/mail/templates/email-verification-mail';
import { getResetPasswordEmailTemplate } from '$lib/server/mail/templates/reset-password-mail';
import { getConfirmPasswordResetEmailTemplate } from '$lib/server/mail/templates/confirm-password-reset-mail';
import { getWelcomeEmailTemplate } from '$lib/server/mail/templates/welcome-mail';
import { passkey } from '@better-auth/passkey';

export const auth = betterAuth({
	appName: 'BlogSpace',
	user: {
		additionalFields: {}
	},
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	plugins: [admin(), sveltekitCookies(getRequestEvent), twoFactor(), passkey(), oneTap()],
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url, token }, request) => {
			await sendMail({
				to: user.email,
				subject: 'Reset your password',
				text: `Click the link to reset your password: ${url}`,
				html: getResetPasswordEmailTemplate(token),
				smtp_user: validatedEnv.SMTP_PASSWORD_RESET_MAIL,
				smtp_name: 'Reset Password'
			});
		},
		onPasswordReset: async ({ user }, request) => {
			await sendMail({
				to: user.email,
				subject: 'Your password has been reset',
				text: `Your password has been reset.`,
				html: getConfirmPasswordResetEmailTemplate(user.email),
				smtp_user: validatedEnv.SMTP_PASSWORD_RESET_MAIL,
				smtp_name: 'Password Reset'
			});
		}
	},
	socialProviders: {
		google: {
			clientId: validatedEnv.GOOGLE_CLIENT_ID,
			clientSecret: validatedEnv.GOOGLE_CLIENT_SECRET
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, token }) => {
			await sendMail({
				to: user.email,
				subject: 'Verify your email address',
				text: `Click the link to verify your email: ${validatedEnv.BETTER_AUTH_URL}/auth/verify-email?token=${token}`,
				html: getVerificationEmailTemplate(token),
				smtp_user: validatedEnv.SMTP_EMAIL_VERIFICATION_MAIL,
				smtp_name: 'Email Verification'
			});
		},
		afterEmailVerification: async (user) => {
			await sendMail({
				to: user.email,
				subject: 'Welcome to BlogSpace',
				text: `Hello ${user.name}, welcome to BlogSpace!`,
				html: getWelcomeEmailTemplate(user.name),
				smtp_user: validatedEnv.SMTP_EMAIL_VERIFICATION_MAIL,
				smtp_name: 'Welcome to BlogSpace'
			});
		}
	}
});
