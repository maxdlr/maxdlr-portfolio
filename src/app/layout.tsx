"use client";
import Tabs from "@/components/tabs/Tabs";
import { Anton } from "next/font/google";
import { PhotoProvider } from "../components/PhotoGallery/PhotosContext";
import "./globals.css";
import { TabsProvider } from "@/components/tabs/TabsContext";

const geistSans = Anton({ weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased mt-8 mx-6 sm:mx-20`}>
        <TabsProvider>
          <Tabs />
          <PhotoProvider>{children}</PhotoProvider>
        </TabsProvider>
      </body>
    </html>
  );
}
