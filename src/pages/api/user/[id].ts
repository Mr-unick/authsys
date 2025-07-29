



import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";
import { VerifyToken } from "@/utils/VerifyToken";



export default async function UserDetails(req, res) {

    let user = await VerifyToken(req, res, null);

    try {     
        const { query: { id }} = req;
       
        if (!user || !user.business) {
            return res.status(400).json({
                message: "Business ID not found in user data",
                data: []
            });
        }

        const users = await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .leftJoin('user.business', 'business')
            .leftJoinAndSelect('user.activities','activities')
            .leftJoinAndSelect('activities.lead','lead')
            .leftJoinAndSelect('user.leads','leads')
            .where('business.id = :businessid', { businessid: user.business })
            .andWhere('user.id = :id', { id: id })
            .getOne();

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error : error.message });
    }
};
