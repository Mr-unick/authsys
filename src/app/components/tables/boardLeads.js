import { useCallback, useEffect, useState } from "react";
import { ROOT_URL, SampleLeads, Stages } from "../../../../const";
import BoardCard from "../cards/boardcard";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function BoardLeads() {
  const [stages, setstages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchdata = useCallback(() => {

    setLoading(true);
    axios
      .get(`/api/getBoardLeadProps`)
      .then((res) => res.data)
      .then((res) => {
        setstages(res.data.stages);
        setLeads(res.data.leads);
        setLoading(false);
      }).catch((e) => {
        setLoading(false);
      });
    return;
  }, []);


  useEffect(() => {
    handleFetchdata();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh] w-full">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  }


  return (
    <div className="h-full pb-5">
      <div className="flex overflow-x-auto gap-6 h-full pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {stages.map((stage) => {
          const stageLeads = leads.filter(l => l.stage === stage.stage_name);
          return (
            <div key={stage.id || stage.stage_name} className="flex-shrink-0 w-[320px] max-sm:w-full flex flex-col">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: stage.colour || '#4F46E5' }}
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                  />
                  <h3 className="text-sm font-bold text-[#0F1626] uppercase tracking-wider">
                    {stage.stage_name}
                  </h3>
                </div>
                <span className="bg-gray-100 text-[#0F1626] text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-gray-200">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="overflow-y-auto pr-1 flex flex-col gap-4 max-h-[calc(100vh-250px)] min-h-[200px] scrollbar-hide">
                {stageLeads.length > 0 ? (
                  stageLeads.map((data, index) => (
                    <BoardCard key={data.id || index} data={data} />
                  ))
                ) : (
                  <div className="py-10 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-gray-300 gap-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-300">No Leads</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
