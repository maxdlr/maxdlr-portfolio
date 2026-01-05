import useBreakpoint from "use-breakpoint";
import ColumnedList from "../ColumnedList/ColumnedList";
import { BREAKPOINTS } from "@/services/constants";

interface HomeWhatIDidProps {
  className: string;
}

const itemList = [
  {
    name: "3D / VFX bachelor degree",
  },
  {
    name: "Web development Bachelor degree",
  },
  {
    name: "Development architecture master's degree",
  },
  {
    name: "Character animation",
  },
  {
    name: "Title sequences",
  },
  {
    name: "TV Documentary graphic design and animation",
  },
  {
    name: "Video game trailer animation",
  },
  {
    name: "Full-Stack development",
  },
];

const HomeWhatIDid = ({ className }: HomeWhatIDidProps) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS);
  console.log(breakpoint);

  const cols =
    breakpoint === "base"
      ? 1
      : ["lg", "xl", "2xl"].includes(breakpoint as string)
        ? 3
        : 2;

  return (
    <div className={`${className}`}>
      <p className="text-start text-2xl">What I've done</p>
      <ColumnedList
        cols={cols}
        itemsGap={3}
        list={itemList.map((item) => (
          <p>{item.name}</p>
        ))}
      />
    </div>
  );
};

export default HomeWhatIDid;
