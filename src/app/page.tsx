"use client";
import Button from "@/components/Button/Button";
import Dev from "@/components/Dev/Dev";
import Landing from "@/components/Landing/Landing";
import Motion from "@/components/Motion/Motion";
import Photos from "@/components/Photos/Photos";
import { useEffect, useState } from "react";
import { UrlParams } from "@/services/urlParams";

interface Tab {
  label: string;
  slug: string;
  url?: string;
}

interface Tabs {
  [key: string]: Tab;
}

const Home = () => {
  const tabs: Tabs = {
    home: { label: "Home", slug: "home" },
    motion: { label: "Motion", slug: "motion" },
    dev: { label: "Dev", slug: "dev" },
    photos: { label: "Photos", slug: "photos" },
  };

  const [tab, setTab] = useState<Tab>(tabs.home);

  useEffect(() => {
    const tabParam = UrlParams.get("tab")?.toLowerCase() || "home";
    setTab(tabs[tabParam] || tabs.home);
  }, []);

  useEffect(() => {
    const unsub = UrlParams.onChange(() => {
      const tabParam = UrlParams.get("tab")?.toLowerCase() || "home";
      setTab(tabs[tabParam] || tabs.home);
    });
    return unsub;
  }, []);

  const handleTabSelect = (tab: Tab) => {
    setTab(tab);
    UrlParams.set("tab", tab.slug);
  };

  const TabContent = () => {
    switch (tab?.label) {
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

  const Tab = (tab: Tab) => (
    <Button
      className={`${tab?.label === tab.label ? "text-white" : "text-gray-700"} text-2xl`}
      label={tab.label}
      onClick={() => handleTabSelect(tab)}
      url={tab.url}
    />
  );

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
