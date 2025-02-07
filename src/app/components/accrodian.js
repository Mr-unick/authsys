import { HomeIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/components/ui/accordion";
import Link from "next/link";
import { NavLink } from "./nav/sidebar";

export const NavAccorddian = ({ route }) => {
  const { nestedRoutes } = route;

  return (
    <Accordion type="multiple" collapsible>
      <AccordionItem
        value="item-1"
        className="border-none  font-medium text-xs "
      >
        <AccordionTrigger className="font-medium px-2 text-sm text-gray-300">
          {route.title}
        </AccordionTrigger>
        {nestedRoutes.map((nesteddata) => {
          return (
          
              <AccordionContent className=" font-medium flex gap-2 text-sm text-gray-300">
                  <NavLink href={nesteddata.url}>

                  <div className="flex gap-2 items-center"> <HomeIcon size={15} /> {nesteddata.title}</div>
                  </NavLink>
              </AccordionContent>
           
          );
        })}
      </AccordionItem>
    </Accordion>
  );
};
