
import { useEffect, useState } from 'react';
import { ROOT_URL } from '../../../../const';
import LeadDetails from '../../../app/components/tables/leadDeatails';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function page(){
  
  const router = useRouter();
  const { id } = router.query; 
  const [leadDetails, setLeadDetails] = useState(null);


  const getLeadDetails = async (id) => {
    if (!id) return;
    const response = await axios.get(`${ROOT_URL}api/leaddetails/getleaddetails?id=${id}`);
    setLeadDetails(response.data.data);
  }

  useEffect(() => {
    getLeadDetails(id);
  }, [id]);

  
  
  return (
    <div className=' bg-white  rounded-md h-full overflow-y-scroll border max-sm:mx-2'>
      <LeadDetails data={leadDetails}/>
    </div>
  );
};


