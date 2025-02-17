
import { Business } from "../entity/Business"
import { AppDataSource } from "../lib/data-source"




export const BuisnessRepository = AppDataSource.getRepository(Business).extend({

    onlyPermit(businessId: number , userId : number | null ) {

        if(userId){
            return this.createQueryBuilder("buisness")
            .where("buisness.id = :businessId", { businessId })
          
        }else{
            return this.createQueryBuilder("buisness")
            .where("lead.businessId = :businessId", { businessId })
        }
       
    },


})