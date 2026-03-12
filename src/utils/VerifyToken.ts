import { jwtVerify } from 'jose';
import { ResponseInstance } from './instances';
import { haspermission } from './authorization';
import { env } from '@/config/env';
import { AUTH_COOKIE_NAME } from '@/config/constants';
import fs from 'fs';
import path from 'path';

/**
 * Verifies the JWT token from the request cookies and optionally checks policy-based permissions.
 *
 * @param req  - Next.js API request
 * @param res  - Next.js API response
 * @param policy - Permission policy name (e.g. 'users', 'leads'), or null to skip permission check
 * @returns The decoded JWT payload, or sends a 401 response and returns undefined
 */
export const VerifyToken = async (req: any, res: any, policy: string | null) => {
  const token = req.cookies?.token || req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    const logMsg = `[${new Date().toISOString()}] 401: No token in cookies for ${req.url}. Cookies present: ${Object.keys(req.cookies || {}).join(', ')}\n`;
    console.log(logMsg);
    try {
      fs.appendFileSync(path.join(process.cwd(), 'auth_debug.log'), logMsg);
    } catch (e) { }
    const response: ResponseInstance = {
      data: [],
      message: "Unauthorized — no token provided",
      status: 401,
    };
    return res.status(401).json(response);
  }

  try {
    const secretKey = new TextEncoder().encode(env.JWT_SECRET);
    console.log(`Verifying token of length ${token.length} with secret of length ${env.JWT_SECRET.length}`);
    const { payload } = await jwtVerify(token, secretKey);

    // If no policy check needed, return payload directly
    if (policy == null) {
      return payload;
    }

    const isAuthorized = haspermission(payload, `view_${policy}`);

    if (!isAuthorized) {
      const logMsg = `[${new Date().toISOString()}] 403: Insufficient permissions for ${policy} (User ID: ${payload.id})\n`;
      console.log(logMsg);
      try {
        fs.appendFileSync(path.join(process.cwd(), 'auth_debug.log'), logMsg);
      } catch (e) { }
      const response: ResponseInstance = {
        message: "Forbidden — insufficient permissions",
        data: [],
        status: 403,
      };
      return res.status(403).json(response);
    }

    return payload;
  } catch (error: any) {
    const logMsg = `[${new Date().toISOString()}] 401: Token verification failed for ${req.url}. Error: ${error.message}\n`;
    console.log(logMsg);
    try {
      fs.appendFileSync(path.join(process.cwd(), 'auth_debug.log'), logMsg);
    } catch (e) { }
    const response: ResponseInstance = {
      message: `Unauthorized — invalid or expired token: ${error.message}`,
      data: [],
      status: 401,
    };
    return res.status(401).json(response);
  }
};