import { useEffect, useState } from "react";

export interface BoxState {
  index: number;
  isLight: boolean;
  isRound: boolean;
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

const useBoxes = () => {
  const [count, setCount] = useState(50);
  const [boxes, setBoxes] = useState<BoxState[]>(generateBoxes(count));

  useEffect(() => {
    setBoxes(generateBoxes(count));
  }, [count]);

  const toggleAllLight = () => {
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

  const toggleAllRound = () => {
    setBoxes((boxes) =>
      boxes.map((box) => ({
        ...box,
        isRound: !box.isRound,
      })),
    );
  };

  const updateBoxByIndex = (index: number, fn: (box: BoxState) => BoxState) => {
    setBoxes((boxes) =>
      boxes.map((box) => (box.index === index ? fn(box) : box)),
    );
  };

  return {
    boxes,
    count,
    setCount,
    toggleAllLight,
    updateBoxByIndex,
    toggleAllRound,
    setAllLight,
  };
};

export default useBoxes;
