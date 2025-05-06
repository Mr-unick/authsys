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



export const NavAccordion = ({ route,setOpen }) => {
  const { nestedRoutes, title } = route;
  const icon = getIconForRoute(title);

  return (
    <Accordion type="multiple"  collapsible className="border-none">
      <AccordionItem value={`item-${title}`} className="border-b-0">
        <AccordionTrigger className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-indigo-300 hover:bg-indigo-600/10 rounded-lg transition-all duration-200 ">
          <span className="text-gray-400">{icon}</span>
          <span className="flex-1 text-sm hover:no-underline">{title}</span>
        
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-2">
          <div className="flex flex-col gap-1 pl-4">
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