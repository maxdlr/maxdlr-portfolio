import { MediaProcessor } from "./MediaProcessor.ts";
import { Attachment } from "../../services/AttachementService.ts";

export class VideoProcessor extends MediaProcessor {
  public async process(doc: Document): Promise<Document> {
    const videoLinks = doc.querySelectorAll(
      "a[href^='/api/attachments.redirect']",
    );

    await Promise.all(
      Array.from(videoLinks).map(async (link) => {
        const href = new URL(
          link.getAttribute("href")!,
          window.location.origin,
        );
        const id = href.searchParams.get("id");

        if (id) {
          const videoAttachment: Attachment = await this.fetchMedia(id);
          if (videoAttachment) {
            const videoContainer = document.createElement("div");
            videoContainer.className = "video-container";

            const video = document.createElement("video");
            video.controls = true;
            video.classList.add("rounded-lg");

            const source = document.createElement("source");
            source.src = videoAttachment.url as string;
            source.type = "video/mp4";

            video.appendChild(source);
            video.appendChild(
              document.createTextNode(
                "Your browser does not support the video tag.",
              ),
            );
            videoContainer.appendChild(video);

            link.replaceWith(videoContainer);
          }
        }
      }),
    );
    return doc;
  }
}
