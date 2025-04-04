import { SampleLeads } from "../../../../../const";
import NewLeadCard from "../../cards/newLeadCard";






export default function DashboardNewLeads(){
    return(
        <div>
            {
                SampleLeads.map((lead)=>(
                    <NewLeadCard key={lead.id} data={lead} />
                ))
            }
        </div>
    )
}
