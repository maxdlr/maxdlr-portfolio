import { useRive, useViewModelInstanceBoolean } from "@rive-app/react-canvas";
import { useEffect } from "react";

interface TictactoeProps {
  size?: number;
}

const Tictactoe = ({ size = 500 }: TictactoeProps) => {
  const { RiveComponent, rive } = useRive({
    src: "/tictactoe.riv",
    autoBind: true,
    artboard: "game",
    autoplay: true,
    stateMachines: "gameSm",
  });

  const instance = rive?.viewModelInstance;

  const { value: isClear } = useViewModelInstanceBoolean("isClear", instance);
  const { value: play } = useViewModelInstanceBoolean("play", instance);

  useEffect(() => {
    console.log({ isClear });
  }, [isClear]);

  return <RiveComponent style={{ width: size, height: size }} />;
};

export default Tictactoe;
