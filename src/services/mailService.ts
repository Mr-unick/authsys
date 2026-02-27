import nodemailer from 'nodemailer';
import prisma from '@/app/lib/prisma';

export interface BulkMailPayload {
    businessId: number;
    subject: string;
    body: string;
    recipients: string[]; // List of emails
}

/**
 * Sends bulk emails using the business's SMTP configuration.
 */
export async function sendBulkMail(p: BulkMailPayload) {
    try {
        const integration = await prisma.integration.findFirst({
            where: {
                business_id: p.businessId,
                provider: 'email',
                status: 'connected'
            }
        });

        if (!integration || !integration.config) {
            throw new Error('No active Email integration found');
        }

        const config = integration.config as any;

        // Setup transporter
        const transporter = nodemailer.createTransport({
            host: config.smtp_host,
            port: parseInt(config.smtp_port) || 587,
            secure: config.smtp_port === '465',
            auth: {
                user: config.smtp_user,
                pass: config.smtp_pass,
            },
        });

        // Verify connection
        await transporter.verify();

        // Send mails
        // Note: For large volume, this should be queued (BullMQ), but for now we'll do promise.all or a loop
        const results = await Promise.allSettled(p.recipients.map(to => {
            return transporter.sendMail({
                from: `"${config.from_name || 'LeadConverter'}" <${config.from_email || config.smtp_user}>`,
                to,
                subject: p.subject,
                html: p.body,
            });
        }));

        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        console.log(`[MailService] Bulk mail sent for business ${p.businessId}. Success: ${successful}, Failed: ${failed}`);

        return { successful, failed };

    } catch (err: any) {
        console.error('[MailService] Error:', err.message);
        throw err;
    }
}
