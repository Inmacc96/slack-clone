/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ThumbanailProps {
  url: string;
}

const Thumbnail: React.FC<ThumbanailProps> = ({ url }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[80%] md:max-w-[300px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt="Message image"
            className="rounded-md object-cover size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[80%] h-[90%] flex items-center justify-center max-w-[80%] max-h-[90%] border-none bg-transparent p-0 shadow-none overflow-hidden">
        <DialogTitle className="hidden">Message image</DialogTitle>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${url})`,
            objectFit: "contain",
            filter: "blur(20px) brightness(0.5)",
            transform: "scale(1.1)",
          }}
        />
        <div className="h-full flex items-center justify-center z-10">
          <img
            src={url}
            alt="Message image"
            className="rounded-md object-contain h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
