import axios from "axios";
import Dashboard from "./dashboard";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";





export default function Index() {
  const [loading, setLoading] = useState(false);
  const [dashboardprops, setDashboardProps] = useState(null);
  const getdashboardprops = async () => {
    setLoading(true);
    let res = await axios.get('api/getDashboardProps')
   
    setDashboardProps(res.data.data);
    setLoading(false);
  }

  useEffect(() => {
    getdashboardprops();
  }, [])

  if (loading) {
    return <div className="w-full h-[80vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>
  }

  return <Dashboard data={dashboardprops} />
}