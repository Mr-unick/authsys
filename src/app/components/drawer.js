
import {
  Sheet,
  SheetContent,

  SheetTrigger,
} from '../../components/components/ui/sheet'



  export default function DrawerComponent({children ,side }){
    return <Sheet modal={false}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="min-w-[40%]" side={side ? side : 'right'}>
       {/* <LeadDeatailspage/> */}hh
      </SheetContent>
    </Sheet>

  
  }
  