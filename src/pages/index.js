import axios from "axios";
import Dashboard from "./dashboard";
import { useEffect, useState } from "react";





export default function Index(){
  const[loading,setLoading] = useState(false);
  const[dashboardprops,setDashboardProps] = useState(null);
  const getdashboardprops =async ()=>{
    let res = await axios.get('http://localhost:3000/api/getDashboardProps')
    console.log(res.data);
    setDashboardProps(res.data.data);
  }

  useEffect(()=>{
    getdashboardprops();
  },[])

  if(loading){
    return <div>Loading...</div>
  }

  return <Dashboard data={dashboardprops}/>
}