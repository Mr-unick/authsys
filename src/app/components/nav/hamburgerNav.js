import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "../../../components/components/ui/sheet"
import SideBar from "./sidebar"

  
  export const NavBar =()=>{
    return <Sheet>
    <SheetTrigger>Open</SheetTrigger>
      <SheetContent className="w-[50%] max-sm:w-[60%] bg-[#0F1626] max-sm:px-2 max-sm:text-xs" side={'left'}>
     <SideBar/>
    </SheetContent>
  </Sheet>
  
  }