"use client";
import { Tab, useTabs } from "@/components/tabs/TabsContext";
import { useRouter } from "next/navigation";
import Button from "../Button/Button";

const Tabs = () => {
  const router = useRouter();
  const { tab, setTab, tabs } = useTabs();

  const handleTabSelect = (newTab: Tab) => {
    setTab(newTab.label === "Dev" ? tab : newTab);
    router.push(newTab.uri);
  };

  const Tab = (tabItem: Tab) => (
    <Button
      className={`${tab?.label === tabItem.label ? "text-gray-400" : "text-gray-700"} text-2xl hover:text-gray-300`}
      Icon={
        tab?.label === tabItem.label ? tabItem.icons?.on : tabItem.icons?.off
      }
      onClick={() => handleTabSelect(tabItem)}
      target={tabItem.target}
      url={tabItem.uri.startsWith("http") ? tabItem.uri : undefined}
      border={true}
      rotating={true}
    />
  );
  return (
    <nav className="flex justify-center items-center gap-3 text-center h-[10svh] min-h-20">
      {Object.values(tabs).map((tab: Tab) => (
        <div key={tab.label}>{Tab(tab)}</div>
      ))}
    </nav>
  );
};
export default Tabs;
