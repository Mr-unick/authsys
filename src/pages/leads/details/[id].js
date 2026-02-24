
import { useContext, useEffect, useState } from 'react';
import { ROOT_URL } from '../../../../const';
import LeadDetails from '../../../app/components/tables/leadDeatails';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { LeadContext, LeadProvider, useLead } from '@/app/contexts/leadontext';

export default function page() {

  const router = useRouter();
  const { id } = router.query;
  const [leadDetails, setLeadDetails] = useState(null);
  const [loading, setLoading] = useState(false);


  const getLeadDetails = async (id) => {
    if (!id) return;
    setLoading(true);
    const response = await axios.get(`/api/leaddetails/getleaddetails?id=${id}`);
    setLeadDetails(response.data.data);

    setLoading(false);
  }
  // hello
  useEffect(() => {
    getLeadDetails(id);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // Listen for real-time updates via SSE
    const eventSource = new EventSource('/api/activities/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.heartbeat) return;

      // If the incoming activity is related to this lead, refresh the details
      if (data.leadId === Number(id) || (data.lead && data.lead.id === Number(id))) {
        getLeadDetails(id);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error in Lead Details:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [id]);




  return (

    <div className='   h-full overflow-y-scroll  max-sm:mx-2'>
      {
        loading ? <div className='flex justify-center items-center h-[70vh] '>
          <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
        </div> : <LeadProvider>
          <LeadDetails data={leadDetails} refresh={() => getLeadDetails(id)} />
        </LeadProvider>
      }

    </div>

  );
};


