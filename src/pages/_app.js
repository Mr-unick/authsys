
import { useEffect } from "react";
import HomeLayout from "../app/components/layouts/homeLayouyt";
import "../app/globals.css";
import { useRouter } from 'next/router';

import { SessionProvider } from "next-auth/react";



function MyApp({ Component, pageProps }) {

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = true;

    if (!isAuthenticated) {
      router.push('/login');
    }
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <HomeLayout>
      <Component {...pageProps} />
      </HomeLayout>
    </SessionProvider>
  );
}

export default MyApp;
