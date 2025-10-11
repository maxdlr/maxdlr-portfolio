"use client";
import Button from "@/components/Button/Button";
import Dev from "@/components/Dev/Dev";
import Landing from "@/components/Landing/Landing";
import Motion from "@/components/Motion/Motion";
import Photos from "@/components/Photos/Photos";
import { useState } from "react";

interface Tab {
  label: string;
  hash: string;
  url?: string;
}

interface Tabs {
  [key: string]: Tab;
}

const Home = () => {
  const tabs: Tabs = {
    home: { label: "Home", hash: "home" },
    motion: { label: "Motion", hash: "motion" },
    dev: { label: "Dev", hash: "dev" },
    photos: { label: "Photos", hash: "photos" },
  };

  let hash: string;
  if (location) {
    hash = location.hash.replace("#", "").toLowerCase();
  } else {
    hash = "home";
  }

  const [currentTab, setCurrentTab] = useState(
    Object.values(tabs).find((t: Tab) => t.hash === hash) || tabs.home,
  );

  console.log(window.location.pathname);

  const handleTabSelect = (tab: Tab) => {
    setCurrentTab(tab);
    window.location.hash = tab.hash;
  };

  const TabContent = () => {
    switch (currentTab?.label) {
      case tabs.home.label:
        return Landing();
      case tabs.motion.label:
        return Motion();
      case tabs.dev.label:
        return Dev();
      case tabs.photos.label:
        return Photos();
      default:
        return Landing();
    }
  };

  const Tab = (tab: Tab) => {
    return (
      <Button
        className={`${currentTab?.label === tab.label ? "text-white" : "text-gray-700"} text-2xl`}
        label={tab.label}
        onClick={() => handleTabSelect(tab)}
        url={tab.url}
      />
    );
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 text-center">
        {Object.values(tabs).map((tab) => (
          <div key={tab.label}>{Tab(tab)}</div>
        ))}
      </div>
      <div className="mt-10">
        <TabContent />
      </div>
    </>
  );
};

export default Home;
