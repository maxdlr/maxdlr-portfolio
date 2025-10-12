"use client";

import { Photo } from "@/app/api/photos/route";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { UrlParams } from "@/services/urlParams";
import { AnimatePresence, motion } from "framer-motion";

const Photos = () => {
  const [isClient, setIsClient] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [category, setCategory] = useState<string>("all");

  // mark as client-only
  useEffect(() => {
    setIsClient(true);
  }, []);

  // fetch photos after mount
  useEffect(() => {
    if (!isClient) return;

    const fetchPhotos = async () => {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data);

      const catParam = UrlParams.get("cat");
      const validCategories = ["all", ...new Set(data.map((p) => p.category))];
      if (catParam && validCategories.includes(catParam)) {
        setCategory(catParam);
      } else {
        setCategory("all");
      }
    };
    fetchPhotos();
  }, [isClient]);

  // handle back/forward navigation
  useEffect(() => {
    if (!isClient) return;
    const unsub = UrlParams.onChange(() => {
      const newCat = UrlParams.get("cat") || "all";
      setCategory(newCat);
    });
    return unsub;
  }, [isClient]);

  const handleCategorySelect = (newCategory: string) => {
    setCategory(newCategory);
    UrlParams.set("cat", newCategory);
  };

  if (!isClient) return null; // render nothing on SSR

  const filteredPhotos =
    category === "all" ? photos : photos.filter((p) => p.category === category);

  const categories = Array.from([
    "all",
    ...new Set(photos.map((p) => p.category)),
  ]);

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

      <AnimatePresence mode="wait">
        <motion.div
          key={category || "all"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.path}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <Image
                src={photo.path}
                alt={photo.alt}
                width={300}
                height={300}
                className="rounded-lg shadow-md"
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Photos;
