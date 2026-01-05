import ColumnedList from "../ColumnedList/ColumnedList";

interface HomeTechStackProps {
  className: string;
}

const devList = [
  "Javascript",
  "Typescript",
  "Java",
  "Php",
  "React",
  "Vue",
  "Angular",
  "Spring Boot",
  "Symfony",
  "NextJs",
];

const motionList = ["After Effects", "Rive", "Blender"];

const HomeTechStack = ({ className }: HomeTechStackProps) => {
  return (
    <div className={className}>
      <h1 className="text-2xl">Techstack</h1>
      <div className="flex flex-col gap-1">
        <ColumnedList list={devList} />
        <ColumnedList list={motionList} />
      </div>
    </div>
  );
};

export default HomeTechStack;
