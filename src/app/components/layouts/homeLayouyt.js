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
import { CircleUserRoundIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/components/ui/popover"


export default function HomeLayout({ children }) {
  const router = useRouter();


  const { asPath } = router;


  let allBreadClumbps = new Map();

  const logout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (response.ok) {
      router.push('/login');
    }

    toast.success("Logged Out !");

  }


  let breadcrumb = "/";

  asPath
    .slice(1)
    .split("/")
    .forEach((url) => {
      breadcrumb = breadcrumb + url + "/";
      allBreadClumbps.set(url, breadcrumb);
    });


  let BreadCrumbArry = [...allBreadClumbps].map((key, value) => {
    return {
      key: key[0],
      value: key[1]
    };
  })

  


  return (
    <div className="w-screen  h-screen flex overflow-hidden bg-[#F4F4F4] max-sm:bg-white ">
      <div className="w-[17%]  min-xl:w[20$] min-lg[20%]  min-sm:w-[20%] bg-[#0F1626] max-lg:hidden flex flex-col justify-start items-center">
        <SideBar />
      </div>
      <div className="w-[83%] min-xl:w[80$] min-lg[80%] min-md:w[80%] max-lg:w-[100%] max-sm:w-[100%] relative ">
        <div className="w-full  flex justify-between px-10  max-sm:px-3 min-sm:px-5 py-4  max-sm:py-2 ">
          <div className="hidden max-lg:flex ">
            <NavBar />
          </div>

          {asPath == "/" ? (
            <HeaderBar title={"Dashboard"} isDash={true} />
          ) : (
            <Breadcrumb className="max-sm:hidden">
              <BreadcrumbList>
                {
                  BreadCrumbArry.map(bread => {
                    return <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href={bread.value}>{bread.key.substring(0, 1).toUpperCase() + bread.key.substring(1)}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  })
                }

              </BreadcrumbList>
            </Breadcrumb>
          )}
          <div className="">

            <Popover>
              <PopoverTrigger className="flex justify-center items-center "> 
                {/* <CircleUserRoundIcon size={26} className="text-gray-600" /> */}
                <div className="flex flex-col max-sm:hidden h-10 text-end justify-center items-end mx-2 text-gray-600">
                  <p className="text-sm ">Admin</p>
                  <p className="text-sm">Nikhil Lende</p>
                </div>
                <img src={"https://images.pexels.com/photos/8367793/pexels-photo-8367793.jpeg"} 
                className="rounded-full object-cover h-10 w-10 max-sm:h-6 max-sm:w-6" alt="logo" width={10} height={10} />
               
              </PopoverTrigger>
              <PopoverContent className="mr-3 max-sm:w-[9rem] flex flex-col gap-2">
                <button className="w-full flex justify-center items-center gap-2 border border-gray-200 p-2 rounded-md" onClick={logout}>
                  <p className="text-sm">Logout</p>
                </button>
                <button className="w-full flex justify-center items-center gap-2 border border-gray-200 p-2 rounded-md" >
                  <p className="text-sm">Profile</p>
                </button>
              </PopoverContent>
            </Popover>
            
          </div>
        </div>
        <div className="w-full h-full  px-10 max-sm:px-1 overflow-y-scroll max-h-fit max-sm:h-full ">{children}</div>
      </div>
    </div>
  );
}
