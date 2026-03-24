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
  Activity,
  Calendar,
  Mail,
  HelpCircle,
  ChevronRight,
  Folder,
  Layers,
  Bell,
  BriefcaseBusiness,
  UserCircle,
  LogOut,
  Loader2,
  Zap,
  Plug,
  Fingerprint,
} from "lucide-react";
import { NavAccordion } from "../accrodian";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";


// Icon mapping based on route titles
const getIconForRoute = (title, unreadCount = 0) => {
  const iconMap = {
    "Notifications": (
      <div className="relative">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
    ),
    "Dashboard": <Home size={18} />,
    "Settings": <Settings size={18} />,
    "Manage Users": <Users size={18} />,
    "Activity": <Activity size={18} />,
    "Calendar": <Calendar size={18} />,
    "Messages": <Mail size={18} />,
    "Business Settings": <BriefcaseBusiness size={18} />,
    "Leads": <Users size={18} />,
    "Integrations": <Plug size={18} />,
    "Support": <HelpCircle size={18} />,
    "Businesses": <BriefcaseBusiness size={18} />,
    "Manage Staff": <Users size={18} />,
    "Staff Roles": <Fingerprint size={18} />,
  };

  return iconMap[title] || <Folder size={18} />;
};

export const NavLink = ({ href, children, icon, onClick }) => {
  const router = useRouter();
  const isActive = href === '/crm'
    ? router.pathname === '/crm'
    : router.pathname.startsWith(href);

  return (
    <Link href={href} onClick={onClick} className="block group">
      <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors duration-200 ${isActive
        ? 'bg-indigo-600 text-white font-semibold'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}>
        <span className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-400'} transition-colors`}>
          {icon}
        </span>
        <span className="text-sm">{children}</span>
      </div>
    </Link>
  );
};

export default function SideBar({ setOpen }) {
  const router = useRouter();
  const [sideBarData, setSideBarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);

    const config = {
      validateStatus: (status) => (status >= 200 && status < 300) || status === 401
    };

    Promise.all([
      axios.get(`/api/getSidebarProps`, config),
      axios.get('/api/auth/isauthenticated', config),
      axios.get('/api/notifications/get', config)
    ]).then(([sidebarRes, authRes, notifRes]) => {
      if (sidebarRes.status === 200) setSideBarData(sidebarRes.data.data);
      if (authRes.status === 200) setUser(authRes.data.data);
      if (notifRes.status === 200 && notifRes.data.data) {
        const unread = notifRes.data.data.filter(n => n.status === 'unread').length;
        setUnreadCount(unread);
      }
    }).catch(err => {
      if (err.response?.status !== 401) {
        console.error("Sidebar fetch error:", err);
      }
    })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully");
      router.push("/signin");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0F1626]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#0F1626] flex flex-col pt-6 pb-4 border-r border-gray-800/30 overflow-y-auto">
      {/* Brand Header */}
      <Link href="/crm" className="px-5 mb-8 block hover:opacity-90 transition-opacity">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">LEAD<span className="text-indigo-400">CONVERTER</span></h1>
            <p className="text-[10px] text-gray-500 tracking-wide">Lead Intelligence</p>
          </div>
        </div>
      </Link>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <div className="space-y-0.5">
          {sideBarData && sideBarData.map((data, index) => (
            data.nestedRoutes ? (
              <NavAccordion key={`${data.title}-${index}`} route={data} setOpen={setOpen} />
            ) : (
              <div key={`${data.title}-${index}`}>
                <button onClick={() => { setOpen && setOpen(false) }} className="w-full">
                  <NavLink
                    href={data.url}
                    icon={getIconForRoute(data.title, data.title === "Notifications" ? unreadCount : 0)}
                  >
                    <span>{data.title}</span>
                  </NavLink>
                </button>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="px-3 mt-4">
        <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
          {user && (
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  className="h-9 w-9 rounded-lg border border-gray-700"
                  alt="avatar"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0F1626] rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
          )}

          <div className="space-y-0.5">
            <NavLink href="/profile" icon={<UserCircle size={18} />}>
              My Profile
            </NavLink>
            <div onClick={handleLogout} className="cursor-pointer">
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors duration-200">
                <LogOut size={18} className="text-red-400" />
                <span className="text-sm font-medium text-red-400">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
