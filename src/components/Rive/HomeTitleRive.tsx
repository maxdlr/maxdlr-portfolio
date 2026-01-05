import { useRive } from "@rive-app/react-canvas";

interface HomeTitleProps {
  width?: number;
  height?: number;
}

const HomeTitleRive = ({ width = 770 }: HomeTitleProps) => {
  const { RiveComponent } = useRive({
    src: "/hometitle.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return (
    <RiveComponent
      style={{
        width,
        height: "160px", // use live values from parent
      }}
    />
  );
};

export default HomeTitleRive;
