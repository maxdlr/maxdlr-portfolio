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
  menu?: boolean;
  white?: boolean;
  boxCount?: number;
  bgClass?: string;
}

const CountStepperWrap = ({
  className,
  count,
  setCount,
  max = 100,
}: {
  className?: string;
  count: number;
  setCount: (count: number) => void;
  max?: number;
}) => (
  <div className={`max-sm:mb-5 justify-center items-center ${className}`}>
    <CountStepper value={count} min={1} max={max} onChange={setCount} />
  </div>
);

const RiveButtonWrap = ({
  className = "",
  label,
  onClick,
}: {
  className?: string;
  label: string;
  onClick: () => void;
}) => (
  <div className={`w-fit h-fit ${className}`}>
    <RiveButton
      label={label}
      onClick={onClick}
      size={{ width: 120, height: 50 }}
    />
  </div>
);

const DynamicMosaicRive = ({
  menu = false,
  white = false,
  boxCount,
  bgClass = "bg-gray-500",
}: DynamicMosaicRiveProps) => {
  const {
    boxes,
    setShape,
    updateBoxByIndex,
    setCount,
    count,
    toggleLightAll,
    setAllLight,
    make,
  } = useBoxes(20);
  useEffect(() => {
    if (boxCount) setCount(boxCount);
  }, [boxCount]);
  useEffect(() => {
    if (white) {
      setAllLight(white);
    }
  }, [boxCount]);

  return (
    <section>
      {menu && (
        <div className="w-full grid grid-cols-3 sm:grid-cols-6">
          <div className="col-span-full mx-auto">
            <CountStepperWrap count={count} setCount={setCount} max={count} />
          </div>
          <RiveButtonWrap label="Rounds" onClick={() => setShape("round")} />
          <RiveButtonWrap
            label="Triangles"
            onClick={() => setShape("triangle")}
          />
          <RiveButtonWrap label="Squares" onClick={() => setShape("square")} />
          <RiveButtonWrap label="Invert" onClick={toggleLightAll} />
          <RiveButtonWrap label="Dark" onClick={() => setAllLight(false)} />
          <RiveButtonWrap label="Light" onClick={() => setAllLight(true)} />
          <RiveButtonWrap label="Checker" onClick={() => make("checker")} />
        </div>
      )}
      <div
        className={`flex flex-wrap justify-center items-center mx-auto w-[20rem] sm:w-[35rem] md:w-[45rem] lg:w-[50rem] ${bgClass} rounded-lg`}
      >
        {boxes.map((box) => (
          <Box
            key={box.index}
            {...box}
            updateBoxByIndex={updateBoxByIndex}
            size={20}
          />
        ))}
      </div>
    </section>
  );
};

export default DynamicMosaicRive;
