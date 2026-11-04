"use client";

import Link from "next/link";
const Projects = ["dynamic-mosaic", "tictactoe"];
const Dev = () => {
  return (
    <>
      {Projects.map((p, i) => (
        <div key={i}>
          <Link key={i} href={`/dev/${p}`}>
            {p && p}
          </Link>
        </div>
      ))}
    </>
  );
};
export default Dev;
