"use client";
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import { useEffect } from "react";
import { usePhotos } from "../../providers/PhotoProvider";

const PhotosDefault = () => {
  const { setCategory, photos, loading } = usePhotos();
  useEffect(() => setCategory("all"));
  return <PhotoGallery photos={photos} loading={loading} />;
};

export default PhotosDefault;
