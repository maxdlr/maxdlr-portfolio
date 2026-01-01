"use client";
import { Photo } from "@/app/api/photos/route";
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { usePhotos } from "../../../providers/PhotoProvider";

const PhotosByCategory = () => {
  const { setCategory, photos, loading } = usePhotos();
  const { category } = useParams();
  useEffect(() => setCategory(category as string));

  return (
    <PhotoGallery
      photos={photos.filter((photo: Photo) => photo.category === category)}
      loading={loading}
    />
  );
};

export default PhotosByCategory;
