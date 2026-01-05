"use client";

import {
  HomeIllustration,
  HomeTitle,
  HomeSocials,
  HomeTechStack,
  HomeLinks,
  HomeWhatIDid,
} from "@/components/Home";

interface Props {
  className: string;
}

const Home = () => {
  const classes =
    "border-[1px] hover:sm:border-gray-700 sm:gap-5 border-transparent sm:px-8 py-6 rounded-2xl sm:text-center h-full flex flex-col justify-center items-center";

  const Lg = ({ className }: Props) => (
    <section
      className={`${className} h-[80svh] grid-cols-4 lg:grid-rows-5 gap-2`}
    >
      <HomeIllustration className={`${classes}`} />
      <HomeTitle className={`${classes} col-span-2`} />
      <HomeSocials className={`${classes}`} />
      <HomeTechStack className={`${classes} row-span-3`} />
      <HomeIllustration className={`${classes}`} />
      <HomeIllustration className={`${classes}`} />
      <HomeLinks className={`${classes} row-span-2`} />
      <HomeWhatIDid className={`${classes} col-span-2 row-span-2`} />
      <HomeIllustration className={`${classes}`} />
      <HomeIllustration className={`${classes}`} />
    </section>
  );

  const Md = ({ className }: Props) => (
    <section
      className={`${className} h-[80svh] grid-cols-2 lg:grid-rows-5 gap-2`}
    >
      <HomeTitle className={`${classes}`} />
      <HomeWhatIDid className={`${classes} row-span-3`} />
      <HomeSocials className={`${classes}`} />
      <HomeTechStack className={`${classes} row-span-2`} />
      <HomeIllustration className={`${classes}`} />
      <HomeLinks className={`${classes}`} />
    </section>
  );

  const Sm = ({ className }: Props) => (
    <section
      className={`${className} h-[170svh] grid-cols-2 lg:grid-rows-5 gap-2`}
    >
      <HomeTitle className={`${classes} col-span-2`} />
      <HomeSocials className={`${classes}`} />
      <HomeLinks className={`${classes}`} />
      <HomeWhatIDid className={`${classes} row-span-2 col-span-2`} />
      <HomeIllustration className={`${classes}`} />
      <HomeIllustration className={`${classes}`} />
      <HomeTechStack className={`${classes} row-span-2 col-span-2`} />
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
