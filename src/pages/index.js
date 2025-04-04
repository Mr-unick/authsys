import axios from "axios";
import Dashboard from "./dashboard";
import { useEffect, useState } from "react";





export default function Index(){
  const[loading,setLoading] = useState(false);
  const[dashboardprops,setDashboardProps] = useState(null);
  const getdashboardprops =async ()=>{
    setLoading(true);
    let res = await axios.get('api/getDashboardProps')
    console.log(res.data);
    setDashboardProps(res.data.data);
    setLoading(false);
  }

  useEffect(()=>{
    getdashboardprops();
  },[])

  if(loading){
    return <div>Loading...</div>
  }

  return <Dashboard data={dashboardprops}/>
}