import { createContext, useEffect, useState } from "react";


export const ResumeContext = createContext();


let initialData = {
  personalInfo: {
    name: '',
    email: '',
    phone:  '',
    address: ''
  },
  education: [],
  projects: [],
  experiencelit: [],
  skills: []
};


let datain =  initialData;



export const ResumeProvider = ({ children }) => {
  const [data, setData] = useState(datain);

  useEffect(()=>{
console.log(data)
  },[data])

  return (
    <ResumeContext.Provider value={{ data, setData }}>
      {children}
    </ResumeContext.Provider>
  );
};
