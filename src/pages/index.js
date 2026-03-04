import axios from "axios";
import Dashboard from "./dashboard";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";





export default function Index() {
  const [loading, setLoading] = useState(false);
  const [dashboardprops, setDashboardProps] = useState(null);
  const router = useRouter();
  const getdashboardprops = async () => {
    if (!router.isReady) return;

    try {
      setLoading(true);
      const res = await axios.get('/api/getDashboardProps', {
        // Prevent axios from throwing on common status codes so we can handle them manually
        validateStatus: (status) => (status >= 200 && status < 300) || status === 401
      });

      if (res.status === 401) {
        console.warn("[Dashboard] Unauthorized, redirecting to sign-in.");
        router.replace('/signin');
        return;
      }

      if (res.data?.status === 200) {
        setDashboardProps(res.data.data);
      }
    } catch (error) {
      console.error("Dashboard fetch error details:", error);
      // Silently handle 401 by redirecting to signin
      if (error && (error.response?.status === 401 || error.status === 401)) {
        router.replace('/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      getdashboardprops();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!dashboardprops) return;

    // Listen for real-time updates via SSE to refresh dashboard stats
    const eventSource = new EventSource('/api/activities/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.heartbeat) return;
        getdashboardprops();
      } catch (err) {
        console.error("SSE parsing error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error in Dashboard Index:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [dashboardprops]);

  if (loading) {
    return <div className="w-full h-[80vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
  }

  return <Dashboard data={dashboardprops} />
}