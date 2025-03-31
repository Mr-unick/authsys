import { Menu, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "../../../components/components/ui/sheet"
import SideBar from "./sidebar"
import { useState } from "react"

export const NavBar = () => {

  const [open, setOpen] = useState(false)

  return <Sheet open={open}>
    <SheetTrigger onClick={() => setOpen(true)}><Menu size={23} /></SheetTrigger>
    <SheetContent className="w-[50%] max-sm:w-[60%] bg-[#0F1626] max-sm:px-2 max-sm:py-2 max-sm:text-xs border-none [&>button]:hidden " side={'left'}>
      <SheetClose onClick={()=>setOpen(false)} className="absolute top-4 right-4" asChild><X size={20} color="white" /></SheetClose>
      <SideBar setOpen={setOpen} />
    </SheetContent>
  </Sheet>

}