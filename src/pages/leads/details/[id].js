
import LeadDetails from '../../../app/components/tables/leadDeatails';
import { useRouter } from 'next/router';

export default function page(){
  
  // const router = useRouter();
  // const { id } = router.query; 

  return (
    <div className='p-4 bg-white rounded-md'>
      {/* <h1>Product ID: {id}</h1> */}
      <LeadDetails/>
    </div>
  );
};


