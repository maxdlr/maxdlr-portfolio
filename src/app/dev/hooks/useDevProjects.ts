"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useDevProjects = () => {
  const { project } = useParams();
  const [currentProject, setCurrentProject] = useState<string | undefined>("");
  useEffect(() => {
    if (project) {
      setCurrentProject(project as string);
    }
  });

  return {
    currentProject,
    setCurrentProject,
  };
};

export default useDevProjects;
