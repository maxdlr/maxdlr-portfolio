"use client";

interface Props {
  className: string;
}

const Home = () => {
  const classes = "bg-gray-900 rounded-2xl  h-full";

  const Lg = ({ className }: Props) => (
    <section
      className={`${className} h-[80svh] grid-cols-4 lg:grid-rows-5 gap-2`}
    >
      <div className={`${classes}`}>illu</div>
      <div className={`${classes} col-span-2`}>
        <h1>Maxdlr</h1>
      </div>
      <div className={`${classes}`}>reseaux sociaux</div>
      <div className={`${classes} row-span-3`}>stack</div>
      <div className={`${classes}`}>illu</div>
      <div className={`${classes}`}>illu</div>
      <div className={`${classes} row-span-2`}>links</div>
      <div className={`${classes} col-span-2 row-span-2`}>What i did</div>
      <div className={`${classes}`}>illu</div>
      <div className={`${classes}`}>illu</div>
      <div className={`${classes} col-span-3`}>what i do</div>
    </section>
  );

  const Md = ({ className }: Props) => (
    <section
      className={`${className} h-[80svh] grid-cols-2 lg:grid-rows-5 gap-2`}
    >
      <div className={`${classes}`}>
        <h1>Maxdlr</h1>
      </div>
      <div className={`${classes} row-span-3`}>What i did</div>
      <div className={`${classes}`}>reseaux sociaux</div>
      <div className={`${classes} row-span-2`}>stack</div>
      <div className={`${classes}`}>illu</div>
      <div className={`${classes}`}>links</div>
      <div className={`${classes}`}>what i do</div>
    </section>
  );

  const Sm = ({ className }: Props) => (
    <section
      className={`${className} h-[170svh] grid-cols-2 lg:grid-rows-5 gap-2`}
    >
      <div className={`${classes} col-span-2`}>
        <h1>Maxdlr</h1>
      </div>
      <div className={`${classes}`}>reseaux sociaux</div>
      <div className={`${classes}`}>links</div>
      <div className={`${classes} row-span-2 col-span-2`}>What i did</div>
      <div className={`${classes}`}>illu</div>
      <div className={`${classes}`}>illu</div>
      <div className={`${classes} row-span-2 col-span-2`}>stack</div>
      <div className={`${classes} col-span-2`}>what i do</div>
    </section>
  );
  return (
    <>
      <Lg className="hidden lg:grid" />
      <Md className="hidden md:grid lg:hidden" />
      <Sm className="grid md:hidden" />
    </>
  );
};

export default Home;
