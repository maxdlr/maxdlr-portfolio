// components/Photos/Photos.jsx
"use client";

import { Photo } from "@/app/api/photos/route";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { useParams } from "next/navigation";

const Photos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { cat } = useParams();
  const [category, setCategory] = useState<string>((cat as string) || "");

  const handleCategorySelect = (category: string) => {
    setCategory(category);
    location.href = location.href + `?cat=${category}`;
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data);
    };
    fetchPhotos();
  }, []);

  const photoCollection = photos.map((photo: Photo) => (
    <Image
      src={photo.path}
      alt={photo.alt}
      key={photo.path}
      width={200}
      height={200}
    />
  ));

  const categoryButtons = photos
    .reduce((acc: string[], photo: Photo) => {
      if (!acc.includes(photo.category)) acc.push(photo.category);
      return acc;
    }, [] as string[])
    .map((category: Photo["category"]) => (
      <Button label={category} onClick={() => handleCategorySelect(category)} />
    ));

  return (
    <>
      <div className="grid grid-flow-col">{categoryButtons}</div>
      <div className="flex flex-wrap">{photoCollection}</div>
    </>
  );
};

export default Photos;
