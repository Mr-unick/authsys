"use client"

import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { NavAccorddian } from "../accrodian.js";
import Link from 'next/link';
import { useRouter } from "next/router.js";
import { HomeIcon } from "lucide-react";




export const NavLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <div className={isActive ? 'bg-[#4E49F2] w-full px-2 py-2 rounded-md -rounded-r-md text-sm gap-2 text-gray-200  items-center font-medium flex' : 'text-gray-300 px-2 text-md font-medium text-sm flex gap-2 items-center'}>
      <Link href={href} >
      {children}
    </Link>
    </div>
  );
};


export default  function SideBar() {

  const[sideBarData,setSideBarData]=useState(null);
  const[loder,setLoder]=useState(false);

  useEffect(() => {
    setLoder(true)
    axios.get('api/getSidebarProps')
      .then((res) => res.data)
      .then((res) => {
        setSideBarData(res.data)
      setLoder(false)
      })
  }, [])


  return (
   
      
      <div className="w-[100%] px-4 text-wh">
        {sideBarData && sideBarData.map((data, key) => (
          
            data.nestedRoutes ?
          
          <NavAccorddian key={key} route={data}/>
           
              : 
          <div 
            key={data.title + key} 
           className="my-3"
          >
           
          <NavLink href={data.url} className='w-[100%] flex '>
         
          {data.title}
         
          </NavLink>
           
            
          </div>
          
        ))}
      </div>
  
  );
}
