import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { env } from '@/config/env';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

/**
 * Singleton mail service using nodemailer.
 * Uses centralized env.ts for SMTP configuration.
 */
class MailService {
  private static instance: MailService;
  private transporter: Transporter;
  private defaultFrom: string;

  private constructor() {
    const config: EmailConfig = {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    };

    this.defaultFrom = env.SMTP_FROM;
    this.transporter = nodemailer.createTransport(config);
  }

  public static getInstance(): MailService {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  /**
   * Send a basic email.
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions: SendMailOptions = {
        from: this.defaultFrom,
        to: Array.isArray(options.to) ? options.to.join(',') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('[MailService] Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send a welcome email to a new user.
   */
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Welcome to Our Platform!',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for joining our platform. We're excited to have you on board!</p>
      `,
    });
  }

  /**
   * Send a password reset email.
   */
  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${env.BASE_URL}/reset-password?token=${resetToken}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  /**
   * Send a verification email.
   */
  async sendVerificationEmail(to: string, verificationToken: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${env.BASE_URL}/verify-email?token=${verificationToken}">Verify Email</a>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    });
  }

  /**
   * Send an email with attachments.
   */
  async sendEmailWithAttachments(
    to: string,
    subject: string,
    text: string,
    attachments: Array<{ filename: string; path: string }>
  ): Promise<void> {
    await this.sendEmail({ to, subject, text, attachments });
  }
}

export default MailService;
