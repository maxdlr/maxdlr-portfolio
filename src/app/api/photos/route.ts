import { readdir } from "fs/promises";
import path from "path";

export interface Photo {
  path: string;
  category: string;
  alt: string;
}

export async function GET() {
  const dir = path.join(process.cwd(), "public/photo-collections");
  const files = await readdir(dir);

  const photoCollection: Photo[] = [];
  const regex = /^([a-zA-Z0-9_-]+)-\d+\.\w+$/;

  files.forEach((file: string) => {
    const match = file.match(regex);
    if (match) {
      photoCollection.push({
        path: "/photo-collections/" + file,
        category: match[1],
        alt: match[1],
      });
    }
  });

  return Response.json(photoCollection);
}
