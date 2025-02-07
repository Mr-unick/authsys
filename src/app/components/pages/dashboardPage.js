'use client'

import { BarCharMonthly } from ".././charts/barchart"
import { PieChartComponent } from ".././charts/donutchart"

// import { useToast } from "@/hooks/use-toast"


export default function DashboardPage(){

    // const { toast } = useToast()
 
      let  leadStages=[
          { "stage": "Prospecting", "count": 1, "description": "Identifying potential leads from the array." },
          { "stage": "Qualification", "count": 1, "description": "Determining the interest and suitability of the lead." },
          { "stage": "Needs Analysis", "count": 1, "description": "Understanding the lead’s needs and requirements." },
          { "stage": "Proposal", "count": 1, "description": "Offering a proposal that aligns with the lead’s needs." },
          
        ]

    return <div className="w-full h-full ">
        <div className=" flex  justify-between flex-wrap pb-5">
  

{
                leadStages.map((data,key)=>{
                    return <div key={key} className="w-[20%] bg-white p-4 flex justify-between  rounded-md shadow-lg">
                        <p>{data.stage}</p><p>{data.count}</p></div>
                })
            }

           

        </div>
     <div className="w-full flex justify-between flex-wrap gap-5">
     <div className="max-md:w-[100%] w-[60%] shadow-lg ">
     <BarCharMonthly/>
 
     </div>
     <div className="max-md:w-[100%] w-[37%]  h-cover flex justify-center items-center bg-white rounded-md shadow-lg border-[1px]">
     <PieChartComponent/>
     </div>
     </div>
    </div>
}