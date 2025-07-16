
import { useContext, useEffect, useState } from 'react';
import { ROOT_URL } from '../../../../const';
import LeadDetails from '../../../app/components/tables/leadDeatails';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { LeadContext, LeadProvider, useLead } from '@/app/contexts/leadontext';

export default function page(){
  
  const router = useRouter();
  const { id } = router.query; 
  const [leadDetails, setLeadDetails] = useState(null);
  const[loading, setLoading] = useState(false);


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

 


  return (
    
      <div className='   h-full overflow-y-scroll  max-sm:mx-2'>
      {
        loading ? <div className='flex justify-center items-center h-screen '>
          <Loader2 className='animate-spin' size={20} />
        </div>  :<LeadProvider> 
          <LeadDetails data={leadDetails} /> 
          </LeadProvider>
      } 
    
    </div>
   
  );
};


