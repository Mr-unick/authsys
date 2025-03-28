import {
  Dialog,
  DialogContent,
  DialogTrigger, DialogClose, DialogFooter
} from "../../components/components/ui/dialog"

export default function Modal({ children, title }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>{title}</span>
      </DialogTrigger>
      <DialogContent className="max-h-fit max-w-fit ">
        {children}
      </DialogContent>
    </Dialog>
  );
}