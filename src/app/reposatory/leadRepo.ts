import { Leads } from "../entity/Leads";
import { AppDataSource } from "../lib/data-source";

/**
 * Extended repository for Leads entity with business-scoped queries.
 */
export const LeadRepository = AppDataSource.getRepository(Leads).extend({
    onlyPermit(businessId: number, userId: number | null) {
        const qb = this.createQueryBuilder("lead")
            .where("lead.businessId = :businessId", { businessId });

        if (userId) {
            qb.innerJoin("lead.users", "user", "user.id = :userId", { userId });
        }

        return qb;
    },
});