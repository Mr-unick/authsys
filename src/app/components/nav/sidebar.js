"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/router";
import {
  Home,
  Settings,
  Users,
  FileText,
  BarChart2,
  Calendar,
  Mail,
  HelpCircle,
  ChevronRight,
  Folder,
  Layers,
  Bell,
  Mouse,
  BriefcaseBusiness
} from "lucide-react";
import { NavAccordion } from "../accrodian";


// Icon mapping based on route titles
const getIconForRoute = (title) => {
  const iconMap = {
    "Notifications": <Bell size={18} />,
    "Dashboard": <BarChart2 size={18} />,
    "Settings": <Settings size={18} />,
    "Mange Users": <Users size={18} />,
    "Activity": <Mouse size={18} />,
    "Calendar": <Calendar size={18} />,
    "Messages": <Mail size={18} />,
    "Buisness Settings": <BriefcaseBusiness size={18} />,
    "Leads": <Users size={18} />,

  };

  return iconMap[title] || <Folder size={18} />;
};

export const NavLink = ({ href, children, icon }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
        ? 'bg-indigo-600 text-white font-medium'
        : 'text-gray-300 hover:bg-indigo-600/10 hover:text-indigo-300'
        }`}>
        <span className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
          {icon}
        </span>
        <span className="text-sm">{children}</span>
      </div>
    </Link>
  );
};

export default function SideBar({ setOpen }) {
  const [sideBarData, setSideBarData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://authsys-client.vercel.app/api/getSidebarProps`)
      .then((res) => res.data)
      .then((res) => {
        setSideBarData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch sidebar data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#0F1626] flex flex-col py-4">
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 px-2 max-sm:px-0">
          <Layers className="h-6 w-6 text-indigo-500" />
          <h1 className="text-xl font-bold text-white">AppName</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 max-sm:px-0">
        {sideBarData && sideBarData.map((data, index) => (
          data.nestedRoutes ? (
            <NavAccordion key={`${data.title}-${index}`} route={data} setOpen={setOpen} />
          ) : (
            <div key={`${data.title}-${index}`} className="my-1">
              <button onClick={() => setOpen(false)} className="w-full">
                <NavLink
                  href={data.url}
                  icon={getIconForRoute(data.title)}

                >
                  {data.title}
                </NavLink>
              </button>
            </div>
          )
        ))}
      </div>

      <div className="px-4 mt-auto">
        <div className="border-t border-gray-800 pt-4 mt-4">
          <NavLink href="/help" icon={<HelpCircle size={18} />}>
            Help & Support
          </NavLink>
        </div>
      </div>
    </div>
  );
}