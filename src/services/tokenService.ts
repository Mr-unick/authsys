import prisma from '@/app/lib/prisma';
import { encryptToken, decryptToken } from '@/utils/encrypt';

export interface SaveTokenParams {
    businessId: number;
    integrationId: number;
    provider: string;
    accessToken: string;
    refreshToken?: string | null;
    expiresAt?: Date | null;    // absolute expiry date
    expiresIn?: number;         // seconds — alternative to expiresAt
    scopes?: string[];
    tokenType?: string;
}

/** Save or replace a token record for a given integration (upsert via delete+create) */
export async function saveToken(params: SaveTokenParams) {
    const { ciphertext: encAccess, iv: ivAccess } = encryptToken(params.accessToken);

    let encRefresh: string | undefined;
    let ivRefresh: string | undefined;
    if (params.refreshToken) {
        const r = encryptToken(params.refreshToken);
        encRefresh = r.ciphertext;
        ivRefresh = r.iv;
    }

    const expiresAt =
        params.expiresAt ??
        (params.expiresIn ? new Date(Date.now() + params.expiresIn * 1000) : null);

    // Delete existing token record(s) for this integration, then create fresh
    await prisma.integrationToken.deleteMany({
        where: { integration_id: params.integrationId },
    });

    return prisma.integrationToken.create({
        data: {
            business_id: params.businessId,
            integration_id: params.integrationId,
            provider: params.provider,
            access_token: encAccess,       // encrypted ciphertext
            refresh_token: encRefresh ?? null,
            token_type: params.tokenType ?? 'bearer',
            expires_at: expiresAt,
            scopes: params.scopes ? JSON.stringify(params.scopes) : null,
            iv: ivAccess + (ivRefresh ? `||${ivRefresh}` : ''),
        },
    });
}

/**
 * Get decrypted access token for an integration.
 * @param integrationId  The integration DB id
 * @param _businessId    Optional (for future multi-tenant guard)
 * @param _provider      Optional (for future provider check)
 */
export async function getAccessToken(
    integrationId: number,
    _businessId?: number,
    _provider?: string,
): Promise<string | null> {
    const token = await prisma.integrationToken.findFirst({
        where: { integration_id: integrationId },
    });
    if (!token) return null;

    // iv stored as "ivAccess||ivRefresh" or just "ivAccess"
    const ivAccess = token.iv.split('||')[0];
    return decryptToken(token.access_token, ivAccess);
}

/** Check if a token is expired (with 5-minute safety buffer) */
export function isTokenExpired(expiresAt: Date | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() < Date.now() + 5 * 60 * 1000;
}
