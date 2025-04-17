import { Activity, ActivityType } from "@/app/entity/Activity";
import { Leads } from "@/app/entity/Leads";
import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";




export const activityLog = async ({type,description,user,lead}:{type:ActivityType,description:string,user:Users,lead:Leads}) => {

try {
    
    const activity = new Activity();
    activity.type = type;
    activity.description = description;
    activity.user = user;
    activity.lead = lead;

    await AppDataSource.getRepository(Activity).save(activity);

    return true
    
} catch (error) {

    return false
}



}
