import {
  AttachmentService,
  Attachment,
} from "../../services/AttachementService.ts";

export abstract class MediaProcessor {
  protected cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
  }

  public cleanup(): void {
    this.cache.forEach((url) => URL.revokeObjectURL(url));
    this.cache.clear();
  }

  abstract process(doc: Document): Promise<Document>;

  protected async fetchMedia(id: string): Promise<Attachment> {
    if (this.cache.has(id)) return { id: this.cache.get(id) as string }!;

    const fetched = (await AttachmentService.getAttachment(id)) as Attachment;

    if (!fetched.url) {
      console.error(`Failed to fetch media with id ${id}:`, fetched.error);
      return {
        id,
        url: "",
      };
    }

    this.cache.set(fetched.id, fetched.url as string);
    return fetched;
  }
}
