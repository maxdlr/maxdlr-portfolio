import ColumnedList from "../ColumnedList/ColumnedList";

interface HomeLinksProps {
  className: string;
}

const HomeLinks = ({ className }: HomeLinksProps) => {
  return (
    <div className={className}>
      <h1 className="text-2xl">Links</h1>
      <ColumnedList
        list={[
          "Books",
          "Mealie",
          "PodCast",
          "Some music ?",
          "Blog",
          "Augusta Sarlin",
          "Motion Gallery",
        ]}
        itemsGap={2}
      />
    </div>
  );
};

export default HomeLinks;
