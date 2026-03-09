import HomeLayout from "../app/components/layouts/homeLayouyt";
import "../app/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import NotificationManager from "@/app/components/NotificationManager";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const toastConfig = {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: true,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "light",
    limit: 3,
  };

  const content = (
    <>
      <NotificationManager />
      <Component {...pageProps} />
      <ToastContainer {...toastConfig} />
    </>
  );

  return (
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
      {["/signin", "/"].includes(router.pathname) ? (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Component {...pageProps} />
          <ToastContainer {...toastConfig} />
        </div>
      ) : (
        <HomeLayout>{content}</HomeLayout>
      )}
    </ThemeProvider>
  );
}

export default MyApp;
