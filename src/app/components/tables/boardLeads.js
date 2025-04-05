import { useCallback, useEffect, useState } from "react";
import { ROOT_URL, SampleLeads, Stages } from "../../../../const";
import BoardCard from "../cards/boardcard";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function BoardLeads() {
  const [stages, setstages] = useState([]);
  const[leads, setLeads] = useState([]);
  const[loading, setLoading] = useState(false);

  const handleFetchdata = useCallback(() => {

    setLoading(true);
      axios
        .get(`http://localhost:3000/api/getBoardLeadProps`)
        .then((res) => res.data)
        .then((res) => {
          setstages(res.data.stages);
          setLeads(res.data.leads);
        });
    
      setLoading(false);
      return;
    }, []);


    useEffect(() => {
      handleFetchdata();
    }, []);

    if(loading){
      return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin "><Loader2/></div>
      </div>
    }

  return (
    <div className=" h-[100%] pb-5">
      <div className="flex overflow-x-auto gap-5 h-full max-sm:px-2">
        {stages.map((stage) => (
          <div key={stage} className="flex-shrink-0 w-80 max-sm:w-full ">
            <div style={{backgroundColor:stage.colour}} className={`flex justify-between  text-sm  sticky top-0  px-2 py-1 mb-4 rounded-md w-[40%] text-white font-medium`}>
              <p className="max-sm:px-2">{stage.stage_name}</p> <p>10</p>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-8rem)] flex flex-col gap-4  pb-10">
              {leads.map((data, index) => (
                <BoardCard  key={index} data={data} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
