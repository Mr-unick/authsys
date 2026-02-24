import HomeLayout from "../app/components/layouts/homeLayouyt";
import "../app/globals.css";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import NotificationManager from "@/app/components/NotificationManager";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Don't wrap login page in HomeLayout (sidebar/header)
  if (router.pathname === "/signin") {
    return (
      <>
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
      </>
    );
  }

  return (
    <HomeLayout>
      <NotificationManager />
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
