import { Children } from "react"
import { Button } from "../../components/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "../../components/components/ui/drawer"



  export default function DrawerComponent({children }){
    return <Drawer >
    <DrawerTrigger  >{children}</DrawerTrigger>
    <DrawerContent className="h-[95vh]" side={'left'}>
      <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        {/* <Button classname='w-10'>Submit</Button> */}
        <DrawerClose>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  
  }
  