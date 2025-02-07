"use client"

import { ArrowRight, Brain } from "lucide-react";

import { signIn, signOut } from "next-auth/react";
import {  useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";



export default function resume(){

  const { data: session } = useSession();
  const router = useRouter();

  // If the user is already logged in, redirect them to the dashboard or homepage
  useEffect(() => {
    
    if (session) {
      router.push("/resume/resumedashboard"); // or any page you want to redirect to
    }
  }, [session, router]);


    return <section class="px-4 py-24 mx-auto max-w-screen min-w-screen min-h-screen " id="ai">
    <div class="mx-auto text-left  md:text-center w-[80%] ">
      
      <h1 class="mb-6 text-4xl font-extrabold leading-none tracking-normal text-gray-50 md:text-7xl md:tracking-tight">
  Build the perfect <span class="block w-full text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500 lg:inline">
    
    AI-powered Resume</span> in minutes.
</h1>
<p class="px-0 mb-6 text-md text-gray-600 md:text-lg lg:px-24">
  Our AI Resume Builder helps you create a polished and professional resume tailored to your career goals. From automated skills matching to personalized job recommendations, let our smart technology assist you in building the perfect resume and landing your dream job.
</p>

      <div class="mb-4 space-x-0 md:space-x-2 md:mb-8 text-white">
        
        <a class="inline-flex items-center justify-center w-full mb-2 btn btn-light btn-lg sm:w-auto sm:mb-0" href="#">
         
          Explore <ArrowRight size={16}/>

        </a>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    </div>
    <div class="w-full mx-auto mt-10 text-center md:w-4/12">
      <img src="undraw_hiring_8szx.svg" alt="Hellonext feedback boards software screenshot" class="w-full rounded-lg shadow-2xl" />
    </div>
  </section>
  
}