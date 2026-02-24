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
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 leading-none shadow-md shadow-red-900/40">
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
  };

  return iconMap[title] || <Folder size={18} />;
};

export const NavLink = ({ href, children, icon, onClick }) => {
  const router = useRouter();
  // Match exact for '/', prefix match for everything else
  const isActive = href === '/'
    ? router.pathname === '/'
    : router.pathname.startsWith(href);

  return (
    <Link href={href} onClick={onClick} className="block group">
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${isActive
        ? 'bg-indigo-600 shadow-lg shadow-indigo-900/20 text-white font-bold'
        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
        }`}>
        <span className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-400'} transition-colors`}>
          {icon}
        </span>
        <span className="text-sm tracking-wide">{children}</span>
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

    // Fetch user and sidebar in parallel
    Promise.all([
      axios.get(`/api/getSidebarProps`),
      axios.get('/api/auth/isauthenticated'),
      axios.get('/api/notifications/get')
    ]).then(([sidebarRes, authRes, notifRes]) => {
      setSideBarData(sidebarRes.data.data);
      setUser(authRes.data.data);
      const unread = notifRes.data.data.filter(n => n.status === 'unread').length;
      setUnreadCount(unread);
    }).catch(err => console.error("Sidebar catch:", err))
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#0F1626] flex flex-col pt-8 pb-6 border-r border-gray-800/30 shadow-2xl overflow-y-auto">
      {/* Brand Header */}
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">LEAD<span className="text-indigo-500">CONVERTER</span></h1>
            <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Lead Intelligence</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="space-y-1">
          {sideBarData && sideBarData.map((data, index) => (
            data.nestedRoutes ? (
              <NavAccordion key={`${data.title}-${index}`} route={data} setOpen={setOpen} />
            ) : (
              <div key={`${data.title}-${index}`} className="my-1">
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
      <div className="px-4 mt-6">
        <div className="bg-gray-800/20 rounded-2xl p-4 border border-gray-800/50">
          {user && (
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  className="h-10 w-10 rounded-xl border border-gray-700 shadow-sm"
                  alt="avatar"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0F1626] rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] font-medium text-gray-500 truncate uppercase tracking-tighter">{user.role}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <NavLink href="/profile" icon={<UserCircle size={18} />}>
              My Profile
            </NavLink>
            <div onClick={handleLogout} className="cursor-pointer mt-1">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all duration-300">
                <LogOut size={18} className="text-red-400" />
                <span className="text-sm font-semibold tracking-wide text-red-400">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
