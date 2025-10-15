"use client";

import { Photo } from "@/app/api/photos/route";
import Image from "next/image";
import { ReactElement, useEffect, useState } from "react";
import Button from "../Button/Button";
import { UrlParams } from "@/services/urlParams";
import { AnimatePresence, motion } from "framer-motion";
import useBreakpoint from "use-breakpoint";

const Photos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const BREAKPOINTS = {
    base: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await fetch("/api/photos");
      const data = await res.json();

      const shuffled = data.sort(() => Math.random() - 0.5);

      setPhotos(shuffled);

      const catParam = UrlParams.get("cat");
      const validCategories = [
        "all",
        ...new Set(data.map((p: Photo) => p.category)),
      ];
      if (catParam && validCategories.includes(catParam)) {
        setCategory(catParam);
      } else {
        setCategory("all");
      }
    };
    setTimeout(() => {
      fetchPhotos();
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const unsub = UrlParams.onChange(() => {
      const newCat = UrlParams.get("cat") || "all";
      setCategory(newCat);
    });
    return unsub;
  }, []);

  const handleCategorySelect = (newCategory: string) => {
    setCategory(newCategory);
    UrlParams.set("cat", newCategory);
  };

  const filteredPhotos =
    category === "all" ? photos : photos.filter((p) => p.category === category);

  const categories = Array.from([
    "all",
    ...new Set(photos.map((p) => p.category)),
  ]);

  const photoElements = filteredPhotos.map(
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
          className="rounded-lg shadow-md"
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
      <div className="grid grid-flow-col gap-2">
        {cols.map((col, i) => (
          <div key={i} className="flex flex-col gap-2">
            {col}
          </div>
        ))}
      </div>
    );
  };

  const cols =
    breakpoint === "xl" || breakpoint === "2xl"
      ? 3
      : breakpoint === "lg" || breakpoint === "md"
        ? 2
        : 1;

  return (
    <>
      <div className="grid grid-flow-col gap-2 mb-4">
        {categories.map((cat) => (
          <Button
            key={cat}
            label={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`${category === cat ? "text-white" : "text-gray-700"} text-xl`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">{masonryGrid(cols || 1)}</AnimatePresence>
    </>
  );
};

export default Photos;
