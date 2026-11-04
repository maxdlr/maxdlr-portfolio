import {
  useRive,
  useViewModelInstanceString,
  useViewModelInstanceBoolean,
  useViewModelInstanceTrigger,
} from "@rive-app/react-canvas";
import { useEffect } from "react";
import { fileConstants } from "../DynamicMosaicRive/DynamicMosaicRive";

interface ButtonProps {
  className?: string;
  label: string;
  onClick?: () => void;
  onIsHovering?: () => void;
  size?: { width?: number; height?: number };
}

const RiveButton = ({
  className,
  label,
  size = { width: 120, height: 70 },
  onClick,
  onIsHovering,
}: ButtonProps) => {
  const { RiveComponent, rive } = useRive({
    src: "/dynamicmosaic.riv",
    stateMachines: fileConstants.button.state,
    artboard: fileConstants.button.artboard,
    autoplay: true,
    autoBind: true,
  });

  const instance = rive?.viewModelInstance;

  const { setValue: setLabel } = useViewModelInstanceString("label", instance);

  const { value: isHovering } = useViewModelInstanceBoolean(
    "isHovering",
    instance,
  );

  useViewModelInstanceTrigger("click", instance, {
    onTrigger: onClick,
  });

  useEffect(() => {
    if (setLabel) setLabel(label);
  }, [label, setLabel]);

  useEffect(() => {
    if (onIsHovering && isHovering) onIsHovering();
  }, [isHovering, onIsHovering]);

  return label && <RiveComponent style={size} />;
};

export default RiveButton;
