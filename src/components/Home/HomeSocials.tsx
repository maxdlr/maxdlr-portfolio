import ColumnedList from "../ColumnedList/ColumnedList";

interface HomeSocialsProps {
  className: string;
}

const HomeSocials = ({ className }: HomeSocialsProps) => {
  return (
    <div className={className}>
      <h1 className="text-2xl">Find me</h1>
      <ColumnedList
        list={["Linkedin", "Github", "Instagram", "Mastodon", "Qimono"]}
      />
    </div>
  );
};

export default HomeSocials;
