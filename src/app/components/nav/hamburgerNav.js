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

  const [open, setOpen] = useState(false);

  return <Sheet open={open}>
    <SheetTrigger asChild>
      <button
        onClick={() => { setOpen(true) }}
        className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={22} strokeWidth={2.5} className="text-white" />
      </button>
    </SheetTrigger>
    <SheetContent className="w-[80%] max-sm:w-[82%] bg-[#0F1626] p-0 border-none [&>button]:hidden" side={'left'}>
      <SheetClose onClick={() => { setOpen(false) }} className="absolute top-4 right-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors" asChild>
        <button aria-label="Close menu"><X size={18} className="text-white" /></button>
      </SheetClose>
      <SideBar setOpen={setOpen} />
    </SheetContent>
  </Sheet>

}