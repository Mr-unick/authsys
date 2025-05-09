"use client"
import { useEffect, useState } from "react";
import HomeLayout from "../app/components/layouts/homeLayouyt";
import "../app/globals.css";
import { useRouter } from 'next/router';

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { ROOT_URL } from "../../const";
import '../app/globals.css'



function MyApp({ Component, pageProps }) {

  const router = useRouter();
  // const [isAuthenticated, setisAuthenticated] = useState(true);


  // const CheckisAuthenticated = async () => {
  //   let res = await axios.get(`${ROOT_URL}/api/auth/isauthenticated`)

  //   if (res.status == 200) {
  //     setisAuthenticated(true)
  //     return;
  //   }
  //   setisAuthenticated(false)
  //   return;

  // }

  // useEffect(() => {
  //   CheckisAuthenticated()
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, []);

  return (
      <HomeLayout>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </HomeLayout>
  );
}

export default MyApp;
