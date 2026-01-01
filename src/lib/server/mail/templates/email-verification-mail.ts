import { validatedEnv } from '$lib/server/env';

export const getVerificationEmailTemplate = (token: string) => {
	const basePath = validatedEnv.BETTER_AUTH_URL;
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1 style="color: #444; margin: 0;">Welcome to Our Blog!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
        <p>Hello,</p>
        <p>Thank you for signing up. To complete your registration and verify your email address, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${basePath}/auth/verify-email?token=${token}" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
        </div>
        <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;"><a href="${basePath}/auth/verify-email?token=${token}">${basePath}/auth/verify-email?token=${token}</a></p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The Blog Team</p>
    </div>
    <div style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        <p>&copy; ${new Date().getFullYear()} Blog. All rights reserved.</p>
    </div>
</body>
</html>
    `;
};
