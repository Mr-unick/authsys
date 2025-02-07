import { Users } from "../entity/Users"
import { AppDataSource } from "../lib/data-source"



export const UserRepository = AppDataSource.getRepository(Users).extend({

    onlyPermit(businessId: number) {
        return this.createQueryBuilder("user")
            .where("user.businessId = :businessId", { businessId })
    },


})