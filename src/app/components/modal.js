import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "../../components/components/ui/dialog"

  
  export default function Modal({children,title}){

    return <Dialog className="w-screen">
    <DialogTrigger>{title}</DialogTrigger>
    <DialogContent className="max-h-fit max-w-fit" >
    {children}
    </DialogContent>
  </Dialog>
  
  }