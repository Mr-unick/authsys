import ModernResume from "../../app/components/resumeTemplate4";
import MinimalResume from "../../app/components/resumeTemplate3";
import { useEffect, useState } from "react";
import ClassicResume from "../../app/components/resumetemplate2";
import CreativeResume from "../../app/components/resumeTemplate5";

export default function Allresume({ resumedata }) {
  const [data, setdata] = useState(null);

  const [template, SetTemplate] = useState("Minimal");

  useEffect(() => {
    setdata(resumedata);
 console.log(resumedata);
 
  }, [template]);

console.log('this',resumedata)
  const handleselect =(e)=>{
  
    SetTemplate(e.target.value);
  }

  return (
    <div>
      <select
        onChange={(e) => {handleselect(e)}}
      >
        <option value={"Minimal"}>Minimal</option>
        <option value={"Modern"}>Modern</option>
        <option value={"Classic"}>Classic</option>
        <option value={"Creative"}>Creative</option>
      </select>

      {data ? (
        <div className="flex flex-col w-[100%] ">
          {template == "Minimal" && (
            <div className="w-full">
              <MinimalResume data={resumedata} />
            </div>
          )}

          {template == "Modern" && (
            <div className="w-full">
             
              <ModernResume data={resumedata} />
            </div>
          )}
          {template == "Classic" && (
            <div className="w-full">
            
              <ClassicResume data={resumedata} />
            </div>
          )}
          {template == "Creative" && (
            <div className="w-full">
              <CreativeResume data={resumedata} />
            </div>
          )}
        </div>
      ) : (
        <h1></h1>
      )}
    </div>
  );
}
