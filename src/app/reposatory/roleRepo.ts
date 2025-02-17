
import { Roles } from "../entity/Roles"
import { AppDataSource } from "../lib/data-source"



export const RolesRepository = AppDataSource.getRepository(Roles).extend({

    onlyPermit(businessId: number) {
        return this.createQueryBuilder("role")
            .where("role.buisnesId = :businessId", { businessId })
            
    },


})