import { z } from 'zod';

export const signInSchema = z.object({
	email: z.email('Please enter a valid email address').min(1, 'Email is required'),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters')
});

export const signUpSchema = z
	.object({
		name: z
			.string()
			.min(1, 'Name is required')
			.min(2, 'Name must be at least 2 characters')
			.max(50, 'Name must be less than 50 characters')
			.regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
		email: z.email('Please enter a valid email address').min(1, 'Email is required'),
		password: z
			.string()
			.min(1, 'Password is required')
			.min(8, 'Password must be at least 8 characters')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
		terms: z.boolean().refine((val) => val === true, {
			message: 'You must accept the terms and conditions'
		})
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const forgotPasswordSchema = z.object({
	email: z.email('Please enter a valid email address').min(1, 'Email is required')
});

export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, 'Password is required')
			.min(8, 'Password must be at least 8 characters')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string().min(1, 'Please confirm your password')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

// Helper function to format Zod errors into a simple object
export function formatZodErrors(error: z.ZodError): Record<string, string> {
	const errors: Record<string, string> = {};
	for (const issue of error.issues) {
		const path = issue.path.join('.');
		if (!errors[path]) {
			errors[path] = issue.message;
		}
	}
	return errors;
}
