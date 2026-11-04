"use client";

import {
  useRive,
  useViewModelInstanceBoolean,
  useViewModelInstanceTrigger,
} from "@rive-app/react-canvas";
import { useEffect } from "react";
import { fileConstants } from "../DynamicMosaicRive";
import { BoxState } from "../hooks/useBoxes";

export interface BoxProps extends BoxState {
  className?: string;
  updateBoxByIndex: (index: number, fn: (box: BoxState) => BoxState) => void;
  size?: number;
}

const Box = ({
  className,
  size = 50,
  index,
  isLight,
  isRound,
  updateBoxByIndex,
}: BoxProps) => {
  const { RiveComponent, rive } = useRive({
    src: "/dynamicmosaic.riv",
    stateMachines: fileConstants.box.state,
    artboard: fileConstants.box.artboard,
    autoplay: true,
    autoBind: true,
  });

  const instance = rive?.viewModelInstance;

  const { setValue: setIsLight } = useViewModelInstanceBoolean(
    "isLight",
    instance,
  );

  const { setValue: setIsRound } = useViewModelInstanceBoolean(
    "isRound",
    instance,
  );

  useEffect(() => {
    if (setIsLight) setIsLight(isLight);
  }, [isLight, setIsLight]);

  useEffect(() => {
    if (setIsRound) setIsRound(isRound);
  }, [isRound, setIsRound]);

  useViewModelInstanceTrigger("click", instance, {
    onTrigger: () => {
      updateBoxByIndex(index, (box) => ({
        ...box,
        isLight: !box.isLight,
      }));
    },
  });

  return (
    <RiveComponent
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default Box;
