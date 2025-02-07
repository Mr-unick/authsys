import { Leads } from "../entity/Leads"
import { AppDataSource } from "../lib/data-source"




export const LeadRepository = AppDataSource.getRepository(Leads).extend({

    onlyPermit(businessId: number , userId : number | null ) {

        if(userId){

            return this.createQueryBuilder("lead")
            .where("lead.businessId = :businessId", { businessId })
            .where('lead.collborators IN (:...ids)', { userId })

        }else{
            return this.createQueryBuilder("lead")
            .where("lead.businessId = :businessId", { businessId })
        }
       
    },


})