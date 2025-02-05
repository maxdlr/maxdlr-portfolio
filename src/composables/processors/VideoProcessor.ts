import { MediaProcessor } from "./MediaProcessor.ts";

export class VideoProcessor extends MediaProcessor {
  public async process(doc: Document): Promise<Document> {
    const videoLinks = doc.querySelectorAll(
      "a[href^='/api/attachments.redirect']",
    );

    await Promise.all(
      Array.from(videoLinks).map(async (link) => {
        if (!link.textContent?.toLowerCase().endsWith(".mp4")) return;

        const href = new URL(
          link.getAttribute("href")!,
          window.location.origin,
        );
        const id = href.searchParams.get("id");

        if (id) {
          const videoUrl = await this.fetchMedia(id);
          if (videoUrl) {
            const videoContainer = document.createElement("div");
            videoContainer.className = "video-container";

            const video = document.createElement("video");
            video.controls = true;

            const source = document.createElement("source");
            source.src = videoUrl;
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
