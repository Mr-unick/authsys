import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";


export default async function searchUsers (req, res) {
    try {
        const query = req.query.q as string;
        if (!query) return res.json([]);

        const users = await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .where("LOWER(user.name) LIKE :query OR LOWER(user.name) LIKE :query", { query: `%${query.toLowerCase()}%` })
            .limit(10)
            .getMany();

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};
