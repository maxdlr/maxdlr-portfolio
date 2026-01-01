"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Photo } from "@/app/api/photos/route";
import { UrlParams } from "@/services/urlParams";

interface PhotoContextType {
  photos: Photo[];
  loading: boolean;
  categories: string[];
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  shownPhoto?: Photo;
  setShownPhoto: Dispatch<SetStateAction<Photo | undefined>>;
  refetch: () => Promise<void>;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [shownPhoto, setShownPhoto] = useState<Photo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("all");
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (photos.length > 0 && !isInitialized) {
      const photoParam = UrlParams.get("p");
      if (photoParam) {
        const photo = photos.find((p) => p.name === photoParam);
        if (photo) {
          setShownPhoto(photo);
        }
      }
      setIsInitialized(true);
    }
  }, [photos, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    if (shownPhoto) {
      UrlParams.set("p", shownPhoto.name);
    } else {
      UrlParams.remove("p");
    }
  }, [shownPhoto, isInitialized]);

  useEffect(() => {
    const cleanup = UrlParams.onChange(() => {
      const photoParam = UrlParams.get("p");
      if (photoParam && photos.length > 0) {
        const photo = photos.find((p) => p.name === photoParam);
        if (photo) {
          setShownPhoto(photo);
        } else {
          setShownPhoto(undefined);
        }
      } else {
        setShownPhoto(undefined);
      }
    });
    return cleanup;
  }, [photos]);

  useEffect(() => {
    setTimeout(() => fetchPhotos(), 1000);
  }, []);

  const categories = Array.from([
    "all",
    ...new Set(photos.map((p) => p.category)),
  ]);

  return (
    <PhotoContext.Provider
      value={{
        photos,
        loading,
        categories,
        category,
        setCategory,
        shownPhoto,
        setShownPhoto,
        refetch: fetchPhotos,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error("usePhotos must be used within a PhotoProvider");
  }
  return context;
};
