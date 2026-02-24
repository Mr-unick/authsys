import { jwtVerify } from 'jose';
import { ResponseInstance } from './instances';
import { haspermission } from './authorization';
import { env } from '@/config/env';

/**
 * Verifies the JWT token from the request cookies and optionally checks policy-based permissions.
 *
 * @param req  - Next.js API request
 * @param res  - Next.js API response
 * @param policy - Permission policy name (e.g. 'users', 'leads'), or null to skip permission check
 * @returns The decoded JWT payload, or sends a 401 response and returns undefined
 */
export const VerifyToken = async (req: any, res: any, policy: string | null) => {
  const token = req.cookies.token;

  if (!token) {
    const response: ResponseInstance = {
      data: [],
      message: "Unauthorized — no token provided",
      status: 401,
    };
    return res.status(401).json(response);
  }

  try {
    const secretKey = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);

    // If no policy check needed, return payload directly
    if (policy == null) {
      return payload;
    }

    const isAuthorized = haspermission(payload, `view_${policy}`);

    if (!isAuthorized) {
      const response: ResponseInstance = {
        message: "Forbidden — insufficient permissions",
        data: [],
        status: 403,
      };
      return res.status(403).json(response);
    }

    return payload;
  } catch (error: any) {
    const response: ResponseInstance = {
      message: "Unauthorized — invalid or expired token",
      data: [],
      status: 401,
    };
    return res.status(401).json(response);
  }
};