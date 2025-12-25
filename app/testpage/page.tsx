import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User2, Calendar, Eye, BookOpenText } from "lucide-react";

interface NoteSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  note: {
    title: string;
    subject: string;
    topic: string;
    author: string;
    views: number;
    date: string;
    description?: string;
  } | null;
}

export default function NoteSummaryDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Note Title</DialogTitle>
            <div className="flex md:flex-col justify-center gap-2 text-xs lg:text-sm my-4 ">
              <p className="bg-primary/20 rounded-xl px-1.5 w-fit text-primary">
                Subject
              </p>
              <p className="bg-primary/20 rounded-xl px-1.5 w-fit text-secondary">
                Topic
              </p>
            </div>
            <DialogDescription className="bg-primary/10 text-foreground text-xs lg:text-sm p-2 rounded-md text-start">
             
                This is a comprehensive summary of the note covering all key
                concepts with diagrams and examples. Perfect for exam
                preparation.
            
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 flex gap-2">
            <span className="flex flex-col md:flex-row justify-items-start text-xs lg:text-md items-center text-wrap justify-center gap-2 text-muted-foreground ">
              <span className="flex items-center text-start gap-2">
                By <User2 size={12} />
                <p className="text-primary text-wrap text-start">
                  Sahil Mhapsekar
                </p>{" "}
              </span>
              <span className="flex items-center gap-2">
                Uploaded on
                <Calendar size={12} />
                <p className="text-primary/70"> 25-01-2026</p>{" "}
              </span>
            </span>
          </div>
          <span className="flex items-center text-sm md:text-xs gap-2">
            {" "}
            <Eye size={16} />
            254678 Views
          </span>

          <DialogFooter className="max-w-full">
            <Button type="submit" className="md:w-32"> <BookOpenText></BookOpenText> View</Button>

          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
