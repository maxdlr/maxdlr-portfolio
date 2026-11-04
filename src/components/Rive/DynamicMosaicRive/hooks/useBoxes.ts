import { useEffect, useState } from "react";

export interface BoxState {
  index: number;
  isLight: boolean;
  isRound: boolean;
  type?: "square" | "round" | "triangle";
}

const generateBoxes = (
  count: number,
  isLight = false,
  isRound = false,
): BoxState[] =>
  Array.from({ length: count }, (_, i) => ({
    index: i,
    isLight,
    isRound,
  }));

const useBoxes = (defaultCount: number) => {
  const [count, setCount] = useState(defaultCount);
  const [boxes, setBoxes] = useState<BoxState[]>(generateBoxes(count));

  useEffect(() => {
    setBoxes(generateBoxes(count));
  }, [count]);

  const toggleLightAll = () => {
    setBoxes((boxes) =>
      boxes.map((box) => ({
        ...box,
        isLight: !box.isLight,
      })),
    );
  };

  const setAllLight = (isLight: boolean) => {
    setBoxes((boxes) =>
      boxes.map((box) => ({
        ...box,
        isLight,
      })),
    );
  };

  const setShape = (shape: BoxState["type"]) => {
    setBoxes((boxes) =>
      boxes.map((box) => ({
        ...box,
        type: shape,
      })),
    );
  };

  const updateBoxByIndex = (index: number, fn: (box: BoxState) => BoxState) => {
    setBoxes((boxes) =>
      boxes.map((box) => (box.index === index ? fn(box) : box)),
    );
  };

  const make = (type: "space-invader" | "checker" = "space-invader") => {
    let changedBoxes = [];
    if (type === "space-invader") {
      changedBoxes = [0, 1];
      changedBoxes.forEach((i) => {
        updateBoxByIndex(i, (box) => ({ ...box, isLight: true }));
      });
    }
    if (type === "checker") {
      changedBoxes = Array.from({ length: count }).map((_, i) => i);
      changedBoxes
        .filter((v) => v % 2 === 0)
        .forEach((i) => {
          updateBoxByIndex(i, (box) => ({ ...box, isLight: true }));
        });
      changedBoxes
        .filter((v) => v % 2 !== 0)
        .forEach((i) => {
          updateBoxByIndex(i, (box) => ({ ...box, isLight: false }));
        });
    }
  };

  return {
    boxes,
    count,
    setCount,
    toggleLightAll,
    updateBoxByIndex,
    setShape,
    setAllLight,
    make,
  };
};

export default useBoxes;
