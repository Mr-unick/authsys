import { useRouter } from "next/router";
import { ChevronRight, Home, BarChart2, Settings, Users, FileText, Calendar, Mail, HelpCircle, Folder, BriefcaseBusiness, Store, Map, Route, Split, ShieldQuestion, Table, LayoutDashboard, File, NotebookText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/components/ui/accordion";
import { NavLink } from "./nav/sidebar";

const getIconForRoute = (title) => {
  const iconMap = {
    "New Leads": <File size={18} />,
    "Leads": <NotebookText size={18} />,
    "Board Leads": <LayoutDashboard size={18} />,
    "Table Leads": <Table size={18} />,
    "Roles And Permissions": <ShieldQuestion size={18} />,
    "Branches": <Split size={18} />,
    "Lead Stages": <Route size={18} />,
    "Area Of Operation": <Map size={18} />,
    "Buisnes Details": <Store size={18} />,
    "Buisness Settings": <BriefcaseBusiness size={18} />
  };

  return iconMap[title] || <Folder size={18} />;
};

export const NavAccordion = ({ route, setOpen }) => {
  const router = useRouter();
  const { nestedRoutes, title } = route;
  const icon = getIconForRoute(title);

  const isAnyChildActive = nestedRoutes.some((nestedRoute) => {
    const { url } = nestedRoute;
    return url === '/crm'
      ? router.pathname === '/crm'
      : router.pathname.startsWith(url);
  });

  return (
    <Accordion type="multiple" collapsible className="border-none">
      <AccordionItem value={`item-${title}`} className="border-b-0">
        <AccordionTrigger
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors duration-200 group hover:no-underline border-none ${
            isAnyChildActive
              ? "text-indigo-400 bg-indigo-600/5"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span
            className={`${
              isAnyChildActive ? "text-indigo-400" : "text-gray-500 group-hover:text-indigo-400"
            } transition-colors`}
          >
            {icon}
          </span>
          <span className="flex-1 text-sm text-left font-medium">
            {title}
          </span>
        </AccordionTrigger>
        <AccordionContent className="pt-0.5 pb-1.5">
          <div className="flex flex-col gap-0.5 pl-4">
            {nestedRoutes.map((nestedRoute, index) => {
              const nestedIcon = getIconForRoute(nestedRoute.title);
              return (
                <button onClick={() => {setOpen && setOpen(false)}} className="w-full hover:no-underline">
                  <NavLink
                    key={`${nestedRoute.title}-${index}`}
                    href={nestedRoute.url}
                    icon={nestedIcon}
                    className="hover:no-underline"
                  >
                    {nestedRoute.title}
                  </NavLink>
                </button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};