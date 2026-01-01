export const getConfirmPasswordResetEmailTemplate = (email: string) => {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1 style="color: #444; margin: 0;">Password Changed</h1>
    </div>
    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
        <p>Hello,</p>
        <p>This email is to confirm that the password for your account <strong>${email}</strong> has been successfully changed.</p>
        <p>If you did not initiate this change, please contact our support team immediately.</p>
        <p>Best regards,<br>The Blog Team</p>
    </div>
    <div style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        <p>&copy; ${new Date().getFullYear()} BlogSpace. All rights reserved.</p>
    </div>
</body>
</html>
    `;
};
