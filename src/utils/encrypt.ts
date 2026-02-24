import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_HEX = process.env.ENCRYPTION_KEY!;

function getKey(): Buffer {
    if (!KEY_HEX || KEY_HEX.length !== 64) {
        throw new Error('ENCRYPTION_KEY must be a 64-char hex string (32 bytes)');
    }
    return Buffer.from(KEY_HEX, 'hex');
}

export interface EncryptedData {
    ciphertext: string; // hex
    iv: string;         // hex
    tag: string;        // hex - GCM auth tag
}

export function encrypt(plaintext: string): EncryptedData {
    const key = getKey();
    const iv = randomBytes(12); // 96-bit IV for GCM
    const cipher = createCipheriv(ALGORITHM, key, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    const tag = (cipher as any).getAuthTag().toString('hex');

    return { ciphertext, iv: iv.toString('hex'), tag };
}

export function decrypt(ciphertext: string, iv: string, tag: string): string {
    const key = getKey();
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'));
    (decipher as any).setAuthTag(Buffer.from(tag, 'hex'));

    let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');
    return plaintext;
}

/**
 * Store an encrypted token. Pass `iv` as `${iv}:${tag}` combined so we only
 * need one DB column for iv.
 */
export function encryptToken(plaintext: string): { ciphertext: string; iv: string } {
    const { ciphertext, iv, tag } = encrypt(plaintext);
    return { ciphertext, iv: `${iv}:${tag}` };
}

export function decryptToken(ciphertext: string, ivWithTag: string): string {
    const [iv, tag] = ivWithTag.split(':');
    return decrypt(ciphertext, iv, tag);
}
