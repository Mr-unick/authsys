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
    <SheetContent className="w-[50%] max-sm:w-[50%] bg-blue-900" side={'left'}>
     <SideBar/>
    </SheetContent>
  </Sheet>
  
  }