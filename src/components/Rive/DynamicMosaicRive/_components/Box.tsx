"use client";

import {
  useRive,
  useViewModelInstanceBoolean,
  useViewModelInstanceTrigger,
} from "@rive-app/react-canvas";
import { useEffect } from "react";
import { BoxState } from "../hooks/useBoxes";
import { fileConstants } from "../DynamicMosaicRive";

export interface BoxProps extends BoxState {
  className?: string;
  updateBoxByIndex: (index: number, fn: (box: BoxState) => BoxState) => void;
}

const Box = ({
  className = "w-[5rem] h-[5rem]",
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

  return <RiveComponent className={className} />;
};

export default Box;
