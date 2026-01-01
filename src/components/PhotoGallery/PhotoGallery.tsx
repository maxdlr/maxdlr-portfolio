"use client";

import { Photo } from "@/app/api/photos/route";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ReactElement } from "react";
import useBreakpoint from "use-breakpoint";
import Loading from "../loading/Loading";
import { usePhotos } from "../../providers/PhotoProvider";
import PhotoShow from "./PhotoShow";
import { BREAKPOINTS } from "@/services/constants";

export interface PhotoProps {
  photos: Photo[];
  loading: boolean;
}

const PhotoGallery = ({ photos, loading }: PhotoProps) => {
  const { shownPhoto, setShownPhoto } = usePhotos();

  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  const photoElements = photos.map(
    (photo): ReactElement => (
      <motion.div
        key={photo.path}
        layout
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
            duration: 0.5,
          },
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <Image
          src={photo.path}
          alt={photo.alt}
          width={1000}
          height={1000}
          className="rounded-lg shadow-md cursor-pointer"
          onClick={() => setShownPhoto(photo)}
        />
      </motion.div>
    ),
  );

  const masonryGrid = (colsCount: number) => {
    if (!photoElements.length) return null;

    const cols: ReactElement[][] = Array.from({ length: colsCount }, () => []);
    photoElements.forEach((photoEl, i) => {
      cols[i % colsCount].push(photoEl);
    });

    return (
      <section className="w-full">
        <div className="grid grid-flow-col gap-2 w-full">
          {cols.map((col, i) => (
            <div key={i} className="flex flex-col gap-2">
              {col}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const cols =
    breakpoint === "xl" || breakpoint === "2xl"
      ? 3
      : breakpoint === "lg" || breakpoint === "md"
        ? 2
        : 1;

  return loading ? (
    <Loading />
  ) : (
    <>
      <PhotoShow photo={shownPhoto} />
      <AnimatePresence mode="wait">{masonryGrid(cols || 1)}</AnimatePresence>
    </>
  );
};

export default PhotoGallery;
