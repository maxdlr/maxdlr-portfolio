"use client";
import DynamicMosaicRive from "@/components/Rive/DynamicMosaicRive/DynamicMosaicRive";
import useDevProjects from "../hooks/useDevProjects";
import Tictactoe from "@/components/Rive/Tictactoe/TictactoeRive";

const DevProjetPage = () => {
  const { currentProject } = useDevProjects();

  if (!currentProject) {
    return "loading";
  }
  return (
    <div className="flex justify-center items-center">
      {currentProject === "dynamic-mosaic" && (
        <DynamicMosaicRive menu white={false} />
      )}
      {currentProject === "tictactoe" && <Tictactoe />}
    </div>
  );
};
export default DevProjetPage;
