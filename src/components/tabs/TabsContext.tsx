"use client";

import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CameraFill,
  CameraStroke,
  HouseFill,
  HouseStroke,
  TagStroke,
  TriangleFill,
  TriangleStroke,
} from "../icons/Icons";
import { useParams, usePathname } from "next/navigation";

export interface Tab {
  label: string;
  uri: string;
  icons?: { on?: ReactElement; off?: ReactElement };
  target?: string;
}

export interface Tabs {
  [key: string]: Tab;
}

const tabs: Tabs = {
  home: {
    label: "Home",
    uri: "/",
    icons: { on: HouseFill, off: HouseStroke },
  },
  motion: {
    label: "Motion",
    uri: "/motion",
    icons: { on: TriangleFill, off: TriangleStroke },
  },
  dev: {
    label: "Dev",
    uri: "https://github.com/maxdlr",
    icons: { off: TagStroke },
    target: "_blank",
  },
  photos: {
    label: "Photos",
    uri: "/photos",
    icons: { on: CameraFill, off: CameraStroke },
  },
};

interface TabContextType {
  tab: Tab;
  setTab: Dispatch<SetStateAction<Tab>>;
  tabs: Tabs;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const [tab, setTab] = useState<Tab>(tabs.home);
  const pathname = usePathname();
  const { category } = useParams();

  useEffect(() => {
    const foundUri = pathname.replace(`/${category as string}`, "");
    if (category || foundUri !== tab.uri) {
      setTab(
        Object.values(tabs).find((t: Tab) => t.uri === foundUri) || tabs.home,
      );
    }
  });

  return (
    <TabContext.Provider
      value={{
        tab,
        setTab,
        tabs,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

// Custom hook for easy use
export const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabs must be used within a PhotoProvider");
  }
  return context;
};
