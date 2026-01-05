"use client";
import useDevProjects from "../hooks/useDevProjects";

const DevProjetPage = () => {
  const { ProjectsComponent } = useDevProjects();

  if (!ProjectsComponent) {
    return "loading";
  }
  return (
    <div className="flex justify-center items-center">
      <ProjectsComponent menu />
    </div>
  );
};
export default DevProjetPage;
