import { MediaProcessor } from "./MediaProcessor.ts";

export class ImgProcessor extends MediaProcessor {
  public async process(doc: Document): Promise<Document> {
    const images = doc.querySelectorAll("img[src^='/api/attachments']");

    await Promise.all(
      Array.from(images).map(async (img) => {
        const srcUrl = new URL(
          img.getAttribute("src")!,
          window.location.origin,
        );
        const id = srcUrl.searchParams.get("id");

        if (id) {
          const imageUrl = await this.fetchMedia(id);
          if (imageUrl) {
            img.setAttribute("src", imageUrl);
            this.addLightBox(img);
          }
        }
      }),
    );
    return doc;
  }

  private addLightBox(img: Element): void {
    if (img.classList.contains("--lightboxed")) return;

    const newImg = img.cloneNode(true) as HTMLImageElement;
    newImg.classList.add("--lightboxed");

    const link = document.createElement("a");
    link.href = newImg.src;
    link.append(newImg);

    const lightbox = document.createElement("div");
    lightbox.setAttribute("uk-lightbox", "true");
    lightbox.append(link);

    img.replaceWith(lightbox);
  }
}
