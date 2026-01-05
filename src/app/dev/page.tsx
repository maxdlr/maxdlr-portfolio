"use client";

import Link from "next/link";
import { ProjectsMap } from "./hooks/useDevProjects";

const Dev = () => {
  return (
    <>
      {Object.keys(ProjectsMap).map((p, i) => (
        <div key={i}>
          <Link key={i} href={`/dev/${p}`}>
            {p !== "none" && p}
          </Link>
        </div>
      ))}
    </>
  );
};
export default Dev;
