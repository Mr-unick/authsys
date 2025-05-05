import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

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

class MailService {
  private static instance: MailService;
  private transporter: Transporter;
  private defaultFrom: string;

  private constructor() {
 
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      }
    };

    this.defaultFrom = process.env.SMTP_FROM || 'noreply@yourdomain.com';
    this.transporter = nodemailer.createTransport(config);
  }

  public static getInstance(): MailService {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  /**
   * Send a basic email
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

     let res = await this.transporter.sendMail(mailOptions);

      console.log('Mail Sent Succesfully',res)
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = 'Welcome to Our Platform!';
    const html = `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining our platform. We're excited to have you on board!</p>
    `;

    await this.sendEmail({
      to,
      subject,
      html,
    });
  }

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const subject = 'Password Reset Request';
    const html = `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await this.sendEmail({
      to,
      subject,
      html,
    });
  }

  /**
   * Send a verification email
   */
  async sendVerificationEmail(to: string, verificationToken: string): Promise<void> {
    const subject = 'Verify Your Email';
    const html = `
      <h1>Email Verification</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}">Verify Email</a>
      <p>If you didn't create an account, please ignore this email.</p>
    `;

    await this.sendEmail({
      to,
      subject,
      html,
    });
  }

  /**
   * Send an email with attachments
   */
  async sendEmailWithAttachments(
    to: string,
    subject: string,
    text: string,
    attachments: Array<{ filename: string; path: string }>
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject,
      text,
      attachments,
    });
  }
}

export default MailService;


// export const sendMail = MailService.getInstance();
