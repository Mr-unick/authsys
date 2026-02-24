import { Users } from "../entity/Users";
import { AppDataSource } from "../lib/data-source";

/**
 * Extended repository for Users entity with business-scoped queries.
 */
export const UserRepository = AppDataSource.getRepository(Users).extend({
    onlyPermit(businessId: number) {
        if (businessId != null) {
            return this.createQueryBuilder("user")
                .where("user.buisnesId = :businessId", { businessId });
        }
        return this.createQueryBuilder("user");
    },
});