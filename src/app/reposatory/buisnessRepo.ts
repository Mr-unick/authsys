
import { Business } from "../entity/Business"
import { AppDataSource } from "../lib/data-source"




export const BuisnessRepository = AppDataSource.getRepository(Business).extend({

    onlyPermit(businessId: number  ) {

        return this.createQueryBuilder("buisness")
            .where("lead.businessId = :businessId", { businessId })
       
    },


})