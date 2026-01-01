"use client";

import { useEffect } from "react";
import RiveButton from "../Button/Button";
import Box from "./_components/Box";
import { CountStepper } from "./_components/CountStepper";
import useBoxes from "./hooks/useBoxes";

export const fileConstants = {
  mosaic: { state: "mosaic-state", artboard: "mosaic" },
  box: { state: "box-state", artboard: "box" },
  button: { state: "button-state", artboard: "button" },
};

interface DynamicMosaicRiveProps {
  responsive?: boolean;
  menu?: boolean;
  boxCount?: number;
  white?: boolean;
  bgClass?: string;
}

const DynamicMosaicRive = ({
  responsive = true,
  menu = false,
  boxCount,
  white = false,
  bgClass,
}: DynamicMosaicRiveProps) => {
  const {
    boxes,
    count,
    toggleAllLight,
    toggleAllRound,
    setCount,
    updateBoxByIndex,
    setAllLight,
  } = useBoxes();

  useEffect(() => setAllLight(white), [white]);

  useEffect(() => {
    if (boxCount) setCount(boxCount);
  }, [boxCount]);

  return (
    <section>
      {menu && (
        <div className="w-full flex flex-wrap justify-center items-center gap-4">
          <div className="w-fit h-fit">
            <RiveButton
              label="Rounds"
              onClick={toggleAllRound}
              className="w-[120px] h-[70px]"
            />
          </div>
          <div className="h-[70px] sm:flex justify-center items-center hidden">
            <CountStepper value={count} min={1} max={100} onChange={setCount} />
          </div>
          <div className="w-fit h-fit">
            <RiveButton
              label="Invert"
              onClick={toggleAllLight}
              className="w-[120px] h-[70px]"
            />
          </div>
          <div className="h-[70px] justify-center items-center flex sm:hidden">
            <CountStepper value={count} min={1} max={100} onChange={setCount} />
          </div>
        </div>
      )}

      {responsive ? (
        <div
          className={`flex flex-wrap justify-center items-center mx-auto w-[20rem] sm:w-[35rem] md:w-[45rem] lg:w-[50rem] ${bgClass ?? "bg-white"} rounded-lg`}
        >
          {boxes.map((box) => (
            <Box key={box.index} {...box} updateBoxByIndex={updateBoxByIndex} />
          ))}
        </div>
      ) : (
        <div
          className={`flex flex-wrap w-full h-full ${bgClass ?? "bg-white"} rounded-lg`}
        >
          {boxes.map((box) => (
            <Box key={box.index} {...box} updateBoxByIndex={updateBoxByIndex} />
          ))}
        </div>
      )}
    </section>
  );
};

export default DynamicMosaicRive;
