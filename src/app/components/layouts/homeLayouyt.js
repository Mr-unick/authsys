"use client";
import { useRouter } from "next/router";
import { NavBar } from "../nav/hamburgerNav";
import SideBar from "../nav/sidebar";
import HeaderBar from "../nav/header";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/components/ui/breadcrumb";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";

export default function HomeLayout({ children }) {
  const router = useRouter();
 

  const { asPath } = router;


  let allBreadClumbps = new Map();

  const Toast = () => toast.error("Wow so easy!");
  

  let breadcrumb = "/";

  asPath
    .slice(1)
    .split("/")
    .forEach((url) => {
      breadcrumb = breadcrumb + url + "/";
      allBreadClumbps.set(url, breadcrumb);
    });

  
 let BreadCrumbArry = [...allBreadClumbps].map((key,value)=>{
  return {
    key : key[0],
    value : key[1]
  };
  })


  return (
    <div className="w-screen  h-screen flex overflow-hidden bg-[#F4F4F4] ">
      <div className="w-[17%]  min-xl:w[20$] min-lg[20%]  min-sm:w-[20%] bg-[#0F1626] max-lg:hidden flex flex-col justify-start items-center">
        <div className="w-[100%]  my-5 px-5 flex justify-start items-center gap-2 ">
          <Image src={"/icons8logo.svg"} alt="logo" width={30} height={30} />
          <p className="text-l text-gray-100">COMPANY LOGO</p>
        </div>
        <SideBar />
      </div>
      <div className="w-[83%] min-xl:w[80$] min-lg[80%] min-md:w[80%] max-lg:w-[100%] relative ">
        <div className="w-full  flex justify-between px-10 max-sm:px-3 min-sm:px-5 py-4  ">
          <div className="hidden max-lg:flex">
            <NavBar />
          </div>

          {asPath == "/" ? (
            <HeaderBar title={"Dashboard"} isDash={true} />
          ) : (
            <Breadcrumb>
              <BreadcrumbList>
              {
                BreadCrumbArry.map(bread=>{
                  return <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={bread.value}>{bread.key.substring(0,1).toUpperCase()+ bread.key.substring(1)}</BreadcrumbLink>
                  </BreadcrumbItem>
                  </>
                })
              }
                
              </BreadcrumbList>
            </Breadcrumb>
          )}
          <div className="">
            <button onClick={Toast}>
              Logout
            </button>
          </div>
        </div>

        <div className="hidden flex-col  max-md:flex px-10 max-sm:px-3 mb-5">
          <p className="font-semibold text-lg">Dashboard</p>
          <p>Good Morning Mr. Nikhil !</p>
        </div>

        <div className="w-full h-full  px-10 max-sm:px-1 overflow-y-scroll max-h-fit">{children}</div>
      </div>
    </div>
  );
}
