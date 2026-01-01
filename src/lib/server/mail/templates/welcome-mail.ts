import { validatedEnv } from '../../env';

export const getWelcomeEmailTemplate = (name: string) => {
	const firstName = name.split(' ')[0] || 'User';
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BlogSpace</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1 style="color: #444; margin: 0;">Welcome Aboard!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
        <p>Hello ${firstName},</p>
        <p>We're thrilled to have you join BlogSpace! Your email has been successfully verified, and your account is now fully active.</p>
        <p>Here are a few things you can do to get started:</p>
        <ul>
            <li>Complete your profile</li>
            <li>Explore trending posts</li>
            <li>Write your first story</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${validatedEnv.BETTER_AUTH_URL}/dashboard" style="background-color: #6d28d9; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
        </div>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Happy writing,<br>The BlogSpace Team</p>
    </div>
    <div style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        <p>&copy; ${new Date().getFullYear()} BlogSpace. All rights reserved.</p>
    </div>
</body>
</html>
    `;
};
