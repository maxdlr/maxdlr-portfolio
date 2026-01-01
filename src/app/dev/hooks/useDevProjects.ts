"use client";
import DynamicMosaicRive from "@/components/Rive/DynamicMosaicRive/DynamicMosaicRive";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const ProjectsMap: Record<string, any> = {
  "dynamic-mosaic": DynamicMosaicRive,
  none: "",
};

const useDevProjects = () => {
  const { project } = useParams();
  const [currentProject, setCurrentProject] = useState<string | undefined>("");
  useEffect(() => {
    if (project) {
      setCurrentProject(project as string);
    }
  });

  const ProjectsComponent = ProjectsMap[currentProject ?? "none"];
  return {
    ProjectsComponent,
    currentProject,
    setCurrentProject,
  };
};

export default useDevProjects;
