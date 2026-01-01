interface HomeTitleProps {
  className: string;
}

const HomeTitle = ({ className }: HomeTitleProps) => {
  return (
    <div className={`${className} flex-col`}>
      <h1 className="text-2xl">Maxdlr</h1>
      <h2 className="text-5xl sm:text-2xl text-wrap text-gray-600">
        My name is <span className="text-white">Maxime de la Rocheterie</span>,
        I'm a <br className="max-sm:hidden" />{" "}
        <span className="text-white">Full-Stack Dev</span> and{" "}
        <span className="text-white">Motion designer</span>
      </h2>
    </div>
  );
};

export default HomeTitle;
