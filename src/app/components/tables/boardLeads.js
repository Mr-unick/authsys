import { useCallback, useEffect, useState } from "react";
import { ROOT_URL, SampleLeads, Stages } from "../../../../const";
import BoardCard from "../cards/boardcard";

export default function BoardLeads() {
  const [stages, setstages] = useState(Stages);

  // const handleFetchdata = useCallback(() => {
  //     axios
  //       .get(`${ROOT_URL}api/${url}`)
  //       .then((res) => res.data)
  //       .then((res) => {
  //         setTableData(res.data);
  //         setRows(res.data.rows);
  //       });
  //     setChange(false);
  //     return;
  //   }, [change]);

  //   // to fetch initial data

  //   useEffect(() => {
  //     handleFetchdata();
  //   }, []);

  return (
    <div className=" h-[100%] pb-5">
      <div className="flex overflow-x-auto gap-5 h-full max-sm:px-2">
        {stages.map((stage) => (
          <div key={stage} className="flex-shrink-0 w-80 max-sm:w-full ">
            <div style={{backgroundColor:stage.colour}} className={`flex justify-between  text-sm  sticky top-0  px-2 py-1 mb-4 rounded-md w-[40%] text-white font-medium`}>
              <p className="max-sm:px-2">{stage.stage}</p> <p>10</p>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-8rem)] flex flex-col gap-4  pb-10">
              {SampleLeads.map((data, index) => (
                <BoardCard  key={index} data={data} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
