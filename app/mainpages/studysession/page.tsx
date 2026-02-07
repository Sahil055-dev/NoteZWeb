import PdfViewer from "@/app/Components/PdfViewer";

export default function PdfPage() {
  return (
    <main className="flex ">
      <div className="lg:w-3/5">
      <PdfViewer />
        
      </div>
      <div className=" lg:hidden lg:w-2/5 lg:border-l-2 lg:border-secondary/30 ">
        
      </div>
    </main>
  );
}
