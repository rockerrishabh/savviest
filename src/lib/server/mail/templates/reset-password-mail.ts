import { validatedEnv } from '$lib/server/env';

export const getResetPasswordEmailTemplate = (token: string) => {
	const basePath = validatedEnv.BETTER_AUTH_URL;
	// Construct the reset link. Usually it points to the frontend reset page with the token.
	// Based on user's redirectTo in client: '/auth/reset-password'
	// The token is used by the server to verify.
	// Note: Better Auth might generate a full URL in the 'url' parameter passed to sendResetPassword,
	// but here we are manually constructing it or using the token if we want a custom UI flow.
	// However, since the user passed 'token' to this function in auth.ts, we will use it.
	// We'll assuming the reset page handles the token via query param.
	const resetLink = `${basePath}/auth/reset-password?token=${token}`;

	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1 style="color: #444; margin: 0;">Password Reset Request</h1>
    </div>
    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
        <p>Hello,</p>
        <p>We received a request to reset your password. If you didn't make this request, you can simply ignore this email.</p>
        <p>To reset your password, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;"><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire shortly for security reasons.</p>
        <p>Best regards,<br>The Blog Team</p>
    </div>
    <div style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        <p>&copy; ${new Date().getFullYear()} BlogSpace. All rights reserved.</p>
    </div>
</body>
</html>
    `;
};
