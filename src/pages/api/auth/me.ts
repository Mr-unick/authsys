import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        business: user.business,
        role: user.role
    });
}
