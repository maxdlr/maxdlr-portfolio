import { Photo } from "@/app/api/photos/route";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePhotos } from "./PhotosContext";

interface PhotoShowProps {
  photo?: Photo;
}

const PhotoShow = ({ photo }: PhotoShowProps) => {
  const { setShownPhoto } = usePhotos();
  const handleClickCapture = (event: any) => {
    const isClickOutside = !!event.target.attributes["data-click-out"];
    if (isClickOutside) return setShownPhoto(undefined);
  };
  return (
    photo && (
      <div className="fixed top-0 left-0 origin-center w-full h-full">
        <div
          data-click-out
          className="flex justify-center items-center h-full p-10"
          onClick={handleClickCapture}
        >
          <AnimatePresence mode="wait">
            <motion.div
              initial={{
                opacity: 0,
                y: "100px",
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  ease: [0, 0.7, 0.2, 1],
                },
              }}
              exit={{
                opacity: 0,
                y: "-100px",
                transition: {
                  ease: [0.3, 0, 0.8, 0],
                },
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <Image
                data-click-in
                src={photo?.path}
                alt={photo.alt}
                width={1000}
                height={1000}
                className="rounded-2xl"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  );
};
export default PhotoShow;
