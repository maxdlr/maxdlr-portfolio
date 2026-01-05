import { ReactNode } from "react";

interface ColumnedListProps {
  cols?: number;
  list: ReactNode[];
  itemsGap?: number;
  className?: string;
}

const ColumnedList = ({
  cols = 2,
  list,
  itemsGap = 1,
  className = "",
}: ColumnedListProps) => {
  const itemsPerCol = Math.ceil(list.length / cols);

  const gridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "md:grid-cols-3 grid-cols-2",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };

  const itemsGapMap: Record<number, string> = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
  };

  return (
    <ul className={`grid ${gridCols[cols]} gap-x-5 ${className}`}>
      {Array.from({ length: cols }).map((_, colIndex) => {
        const start = colIndex * itemsPerCol;
        const end = start + itemsPerCol;

        return (
          <li
            key={colIndex}
            className={`flex flex-col ${itemsGapMap[itemsGap]} text-start`}
          >
            {list.slice(start, end).map((item, itemIndex) => (
              <div key={itemIndex}>{item}</div>
            ))}
          </li>
        );
      })}
    </ul>
  );
};

export default ColumnedList;
