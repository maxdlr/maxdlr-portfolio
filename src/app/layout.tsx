"use client";
import Tabs from "@/components/tabs/Tabs";
import { Anton, Averia_Sans_Libre } from "next/font/google";
import "./globals.css";
import { TabsProvider } from "@/components/tabs/TabsContext";
import { PhotoProvider } from "@/providers/PhotoProvider";

const font = Averia_Sans_Libre({ weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-lt-installed>
      <body className={`${font.className} antialiased mt-8 mx-6 sm:mx-20`}>
        <TabsProvider>
          <Tabs />
          <PhotoProvider>{children}</PhotoProvider>
        </TabsProvider>
      </body>
    </html>
  );
}
