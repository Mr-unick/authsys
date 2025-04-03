
import { useEffect, useState } from 'react';
import { ROOT_URL } from '../../../../const';
import LeadDetails from '../../../app/components/tables/leadDeatails';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function page(){
  
  const router = useRouter();
  const { id } = router.query; 
  const [leadDetails, setLeadDetails] = useState(null);
  const[loading, setLoading] = useState(false);


  const getLeadDetails = async (id) => {
    if (!id) return;
    setLoading(true);
    const response = await axios.get(`${ROOT_URL}api/leaddetails/getleaddetails?id=${id}`);
    setLeadDetails(response.data.data);
    setLoading(false);
  }

  useEffect(() => {
    getLeadDetails(id);
  }, [id]);

  if (loading) return <div className='flex justify-center items-center h-full'>Loading...</div>;

  
  return (
    <div className=' bg-white  rounded-md h-full overflow-y-scroll border max-sm:mx-2'>
      <LeadDetails data={leadDetails}/>
    </div>
  );
};


