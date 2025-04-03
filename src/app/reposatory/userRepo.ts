import { Users } from "../entity/Users"
import { AppDataSource } from "../lib/data-source"



export const UserRepository = AppDataSource.getRepository(Users).extend({

    onlyPermit(businessId: number) {
        if (businessId != null) {
            return this.createQueryBuilder("user")
                .where("user.businessId = :businessId", { businessId })
        } else {
            return this.createQueryBuilder("user")
        }
    },


})