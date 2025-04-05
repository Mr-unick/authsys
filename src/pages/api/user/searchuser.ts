import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";
import { VerifyToken } from "@/utils/VerifyToken";


export default async function searchUsers(req, res) {
    let user = await VerifyToken(req, res, null);
    try {
        const query = req.query.q as string;
        if (!query) return res.json([]);

        if (!user || !user.business) {
            return res.status(400).json({
                message: "Business ID not found in user data",
                data: []
            });
        }

        const users = await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .leftJoin('user.business', 'business')
            .where('business.id = :businessid', { businessid: user.business })
            .andWhere("LOWER(user.name) LIKE :query", { query: `%${query.toLowerCase()}%` })
            .limit(10)
            .getMany();

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};
