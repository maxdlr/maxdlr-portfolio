"use client";
import { Photo } from "@/app/api/photos/route";
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { usePhotos } from "../../../components/PhotoGallery/PhotosContext";

const PhotosByCategory = () => {
  const { setCategory, photos, loading, setShownPhoto } = usePhotos();
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
