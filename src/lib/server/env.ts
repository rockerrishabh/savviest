import { z } from 'zod';
import * as env from '$env/static/private';

const envSchema = z.object({
	DATABASE_URL: z.url(),
	BETTER_AUTH_SECRET: z.string().min(1),
	BETTER_AUTH_URL: z.url(),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	SMTP_HOST: z.string().min(1),
	SMTP_PORT: z.coerce.number(),
	SMTP_EMAIL_VERIFICATION_MAIL: z.email(),
	SMTP_OTP_VERIFICATION_MAIL: z.email(),
	SMTP_WELCOME_MAIL: z.email(),
	SMTP_SUPPORT_MAIL: z.email(),
	SMTP_PASSWORD_RESET_MAIL: z.email(),
	SMTP_PASSWORD: z.string().min(1)
});

export const validatedEnv = envSchema.parse(env);
