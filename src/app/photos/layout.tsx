"use client";
import Button from "@/components/Button/Button";
import { upperFirst } from "@/services/helpers";
import { usePhotos } from "../../providers/PhotoProvider";
import { ReactNode } from "react";

export default function PhotosLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { categories, category, loading } = usePhotos();
  return (
    <div>
      <div className="flex justify-center items-center gap-2 mb-4 text-center">
        {!loading &&
          categories.map((cat: string) => (
            <div key={cat}>
              <Button
                label={upperFirst(cat)}
                url={cat === "all" ? "/photos" : `/photos/${cat}`}
                className={`${category === cat ? "text-white" : "text-gray-700"} text-xl`}
              />
            </div>
          ))}
      </div>
      {children}
    </div>
  );
}
