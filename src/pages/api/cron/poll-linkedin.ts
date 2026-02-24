import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * POST /api/cron/poll-linkedin
 *
 * Master cron trigger — calls the LinkedIn poll endpoint for ALL connected integrations.
 * Schedule: every 15 minutes via Vercel Cron / external scheduler.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const secret = req.headers['x-cron-secret'];
    if (secret !== process.env.CRON_SECRET) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const baseUrl = process.env.BASEURL ?? `http://localhost:${process.env.PORT ?? 3000}`;
        const pollRes = await fetch(`${baseUrl}/api/integrations/poll/linkedin`, {
            method: 'POST',
            headers: {
                'x-internal-secret': process.env.INTERNAL_SECRET ?? 'internal',
                'Content-Type': 'application/json',
            },
        });

        const data = await pollRes.json();
        return res.status(200).json({ triggered: true, ...data });
    } catch (err: any) {
        console.error('[Cron] poll-linkedin failed:', err.message);
        return res.status(500).json({ error: err.message });
    }
}
