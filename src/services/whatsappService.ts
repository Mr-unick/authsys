import axios from 'axios';
import prisma from '@/app/lib/prisma';

export interface WhatsAppPayload {
    businessId: number;
    phone: string;
    message?: string; // Optional if using template
    leadName?: string;
}

/**
 * Sends a WhatsApp message based on the business's integration settings.
 * Supports both CRM shared and Business API methods.
 */
export async function sendWhatsAppNotification(p: WhatsAppPayload) {
    try {
        const integration = await prisma.integration.findFirst({
            where: {
                business_id: p.businessId,
                provider: 'whatsapp',
                status: 'connected'
            }
        });

        // @ts-ignore
        if (!integration || !integration.config) {
            console.log(`[WhatsAppService] No active WhatsApp integration for business ${p.businessId}`);
            return;
        }

        // @ts-ignore
        const config = integration.config as any;
        if (!config.is_active || !p.phone) {
            return;
        }

        // Generate message from template or use provided message
        let finalMessage = p.message || config.welcome_message || "Hello, thanks for your interest!";
        finalMessage = finalMessage.replace(/{{name}}/g, p.leadName || 'there');

        const targetPhone = p.phone.replace(/\D/g, '');

        if (config.sender_type === 'business') {
            await sendViaBusinessApi(config, targetPhone, finalMessage);
        } else {
            await sendViaCrmSharedApi(targetPhone, finalMessage);
        }

    } catch (err: any) {
        console.error('[WhatsAppService] Error:', err.message);
    }
}

async function sendViaBusinessApi(config: any, to: string, message: string) {
    if (!config.api_key || !config.phone_number_id) {
        throw new Error('Missing Meta Business API credentials');
    }

    try {
        // Meta Cloud API for WhatsApp messages
        // Note: Real implementation requires a verified template or 24h window
        // For now using text message format
        await axios.post(
            `https://graph.facebook.com/v21.0/${config.phone_number_id}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.api_key}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`[WhatsAppService] Sent via Business API to ${to}`);
    } catch (err: any) {
        console.error('[WhatsAppService] Business API error:', err.response?.data || err.message);
        throw err;
    }
}

async function sendViaCrmSharedApi(to: string, message: string) {
    // This would typically call a shared Twilio account or similar
    // Implementation placeholder
    console.log(`[WhatsAppService] MOCKED: Sent via CRM Shared API to ${to}. Content: ${message}`);

    // Example Twilio-like call (if configured)
    /*
    await axios.post('https://api.crm-whatsapp-bridge.com/send', {
        to,
        message,
        secret: process.env.INTERNAL_WHATSAPP_SECRET
    });
    */
}
