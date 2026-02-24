import { Business } from "../entity/Business";
import { AppDataSource } from "../lib/data-source";

/**
 * Extended repository for Business entity with business-scoped queries.
 * E21: Fixed query alias bug — was using "lead.businessId" but alias was "buisness".
 */
export const BusinessRepository = AppDataSource.getRepository(Business).extend({
    onlyPermit(businessId: number) {
        return this.createQueryBuilder("business")
            .where("business.id = :businessId", { businessId });
    },
});

// Backward compatibility alias
export const BuisnessRepository = BusinessRepository;