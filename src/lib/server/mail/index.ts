import { validatedEnv } from '$lib/server/env';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

type MailOptions = {
	smtp_user: string;
	smtp_name: string;
	to: string;
	subject: string;
	text: string;
	html: string;
};

export const sendMail = async ({
	smtp_user,
	smtp_name,
	to,
	subject,
	text,
	html
}: MailOptions): Promise<SMTPTransport.SentMessageInfo> => {
	const transporter = nodemailer.createTransport({
		host: validatedEnv.SMTP_HOST,
		port: validatedEnv.SMTP_PORT,
		secure: false, // Use true for port 465, false for port 587
		auth: {
			user: smtp_user,
			pass: validatedEnv.SMTP_PASSWORD
		}
	});

	const info = await transporter.sendMail({
		from: `"${smtp_name}" <${smtp_user}>`,
		to,
		subject,
		text,
		html
	});

	return info;
};
