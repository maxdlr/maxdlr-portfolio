import {
  AttachmentService,
  GetAttachmentReturn,
} from "../services/AttachementService.ts";

interface ImageMatch {
  fullMatch: string;
  src: string;
  id: string;
}

export class ImgProcessor {
  private imageCache: Map<string, string>;

  constructor() {
    this.imageCache = new Map();
  }

  private extractImageInfo(text: string): ImageMatch[] {
    const matches: ImageMatch[] = [];
    const imgRegex = /<img[^>]*src="(\/api\/attachments[^"]*)"[^>]*>/g;

    let match;
    while ((match = imgRegex.exec(text)) !== null) {
      const fullMatch = match[0];
      const src = match[1];
      // Extract ID from the src
      const idMatch = src.match(/id=([^&"]*)/);
      const id = idMatch ? idMatch[1] : "";

      matches.push({ fullMatch, src, id });
    }

    return matches;
  }

  private async fetchImage(id: string): Promise<string> {
    if (this.imageCache.has(id)) {
      return this.imageCache.get(id)!;
    }

    const fetched = (await AttachmentService.getAttachment(
      id,
    )) as GetAttachmentReturn;

    if (!fetched.url) {
      console.error(`Failed to fetch image with id ${id}:`, fetched.error);
      return "/current-project.gif";
    }

    this.imageCache.set(fetched.id, fetched.url as string);
    return fetched.url as string;
  }

  public async processText(text: string): Promise<string> {
    const matches = this.extractImageInfo(text);

    // If no images found, return original text
    if (matches.length === 0) return text;

    let processedText = text;

    // Process all images
    await Promise.all(
      matches.map(async ({ fullMatch, id }) => {
        if (!id) return;

        const imageUrl = await this.fetchImage(id);
        if (imageUrl) {
          processedText = processedText.replace(
            fullMatch,
            fullMatch.replace(/src="[^"]*"/, `src="${imageUrl}"`),
          );
        }
      }),
    );

    return processedText;
  }

  // Clean up object URLs to prevent memory leaks
  public cleanup(): void {
    this.imageCache.forEach((url) => URL.revokeObjectURL(url));
    this.imageCache.clear();
  }
}
