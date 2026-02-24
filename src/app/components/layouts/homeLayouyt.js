"use client";
import { useRouter } from "next/router";
import { NavBar } from "../nav/hamburgerNav";
import SideBar from "../nav/sidebar";
import HeaderBar from "../nav/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/components/ui/breadcrumb";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/components/ui/popover";
import axios from "axios";

export default function HomeLayout({ children }) {
  const router = useRouter();
  const { asPath } = router;

  // E22: Fetch dynamic user info instead of hardcoding
  const [currentUser, setCurrentUser] = useState({
    name: "",
    role: "",
    profileImg: "https://images.pexels.com/photos/8367793/pexels-photo-8367793.jpeg",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/isauthenticated");
        if (res.data?.status === 200 && res.data?.data) {
          setCurrentUser({
            name: res.data.data.name || "User",
            role: res.data.data.role || "User",
            profileImg: "https://images.pexels.com/photos/8367793/pexels-photo-8367793.jpeg",
          });
        }
      } catch {
        // Silently fail — user may not be authenticated yet
      }
    };
    fetchUser();
  }, []);

  // Register service worker and subscribe to push notifications
  useEffect(() => {
    const registerPush = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) return;

        // Convert VAPID public key from base64 to Uint8Array
        const urlBase64ToUint8Array = (base64String) => {
          const padding = '='.repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
          const rawData = window.atob(base64);
          return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
        };

        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        await axios.post('/api/notifications/subscribe', { subscription });
      } catch (err) {
        console.error('Push registration failed:', err);
      }
    };

    registerPush();
  }, []);

  // Build breadcrumbs
  const allBreadCrumbs = new Map();
  let breadcrumb = "/";

  asPath
    .slice(1)
    .split("/")
    .forEach((url) => {
      breadcrumb = breadcrumb + url + "/";
      allBreadCrumbs.set(url, breadcrumb);
    });

  const BreadCrumbArray = [...allBreadCrumbs].map(([key, value]) => ({
    key,
    value,
  }));

  const logout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      router.push("/signin");
    }

    toast.success("Logged Out!");
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#F4F4F4] max-sm:bg-white">
      {/* Desktop Sidebar — hidden on mobile */}
      <div className="w-[17%] bg-[#0F1626] max-lg:hidden flex flex-col justify-start items-center">
        <SideBar />
      </div>

      <div className="w-[83%] max-lg:w-[100%] max-sm:w-[100%] relative flex flex-col">
        {/* Mobile Top Bar — only visible on mobile/tablet */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0F1626] shadow-lg z-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <NavBar />
            <div className="flex items-center gap-2 ml-2">
              <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="9" height="9" rx="1" /><rect x="14" y="4" width="9" height="9" rx="1" /><rect x="1" y="14" width="9" height="9" rx="1" /><rect x="14" y="14" width="9" height="9" rx="1" /></svg>
              </div>
              <h1 className="text-sm font-black text-white tracking-tight">LEAD<span className="text-indigo-400">CONVERTER</span></h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full flex-1 p-4 sm:p-6 max-sm:px-2 overflow-y-auto max-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
