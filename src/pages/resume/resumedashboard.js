import { Plus } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createUser, getResumes, getUser } from "./services";
import { set } from "mongoose";
import Allresume from "./allressume";

const ImageCard = () => {
  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden group shadow-inner shadow-b">
      {/* Image container */}
      <div className="absolute inset-0">
        <img
          src="/image.png"
          alt="Card image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

      {/* Content container */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Beautiful Image Title
        </h3>
        <p className="text-white/90 text-sm">
          A short description that appears on hover
        </p>
      </div>
    </div>
  );
};

async function checkuser(setresuemdata) {
  if (session) {
    let res = await getUser(session.user?.email);

    if (res.status == 404) {
      await createUser({
        username: session.user.name,
        email: session.user.email,
      });
    } else {
      localStorage.setItem("userid", res.data[0]._id);
      let res2 = await getResumes(res.data[0]._id);
      console.log(res2);
    }
  } else {
  }
}

export default function ResumeDashboard() {
  const { data: session, status } = useSession();
  const [resuemdata, setresuemdata] = useState(null);
  const [change, Setchange] = useState(false);

  const router = useRouter();

  async function checkuser(setdata) {
    if (session) {
      let res = await getUser(session.user?.email);
      if (res.status == 404) {
        await createUser({
          username: session.user.name,
          email: session.user.email,
        });
      }
      if (res.status == 201) {
        sessionStorage.setItem("userid", res.data[0]._id);

        let res2;
        if (!resuemdata) {
          res2 = await getResumes(res.data[0]._id);
          setdata(res2);
        }
      }
    } else {
    }
  }

  // If session is still loading, show a loading message
  if (status === "loading") {
    return <p>Loading...</p>;
  } else {
  }

  // If user is not authenticated, redirect to the sign-in page
  if (!session) {
    router.push("/resume/resumeLanding");
    return null;
  } else {
    sessionStorage.setItem("email", session.user.email);
    sessionStorage.setItem("name", session.user.name);
    checkuser(setresuemdata);
  }

  // if (false) {
  //   router.push("/resume/resumesignin");
  // }

  const handleRedirect = (loc) => {
    router.push(loc);
  };

  const handleselect = (data) => {
    localStorage.setItem("currentresumeData", JSON.stringify(data));
    Setchange(true ? false : true);
  };

  console.log(resuemdata);

  return (
    <div className="flex flex-col h-screen w-screen" id="dash">
      <div className="w-full px-10 py-4  flex  justify-between fixed top-0 z-auto ">
        <div className="flex justify-start ">
          <p>LOGO</p>
          {/* <p>Email: {session.user.email}</p> */}
        </div>

        <button onClick={() => signOut()}>Sign out</button>
      </div>

      <div className="w-full px-10 py-4 flex  justify-start flex-col  mt-28">
        <p className="text-6xl font-semibold"> </p>

        <h1 class="mb-6 text-4xl font-extrabold leading-none tracking-normal text-gray-800 md:text-7xl md:tracking-tight">
          <span class="block w-full text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-teal-500 lg:inline">
            Welcome {session.user.name.split(" ")[0]}!
          </span>
        </h1>

        <p className="mt-1">Start creating your professional resume today.</p>
      </div>

      <div className="px-10">
       
      </div>
      <div className="flex flex-col w-full px-10">
        <div className="w-screen flex gap-6 mt-10">
          <button
            onClick={() => {
              handleRedirect("/resume/resumebuilder");
            }}
            className="px-4 py-2 rounded-md text-center bg-blue-600 text-white flex items-center gap-1"
          >
            <Plus size={14} color="white" /> Create Resume
          </button>

          <button
            onClick={() => {
              handleRedirect('/resume/resumeguide');
            }}
            className="px-4 py-2 rounded-md text-center bg-blue-600 text-white flex items-center gap-1"
          >
             Resume Guide
          </button>
          
        </div>
      </div>
      <div className="flex w-screen flex-col-reverse">
      {resuemdata && (
            <div className="flex gap-4 w-screen flex-col-reverse">
              {resuemdata?.map((data) => {
                return <Allresume resumedata={data} />;
              })}
            </div>
          )}
        </div>
    </div>
  );
}
