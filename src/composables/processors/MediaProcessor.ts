import {
  AttachmentService,
  GetAttachmentReturn,
} from "../../services/AttachementService.ts";

export abstract class MediaProcessor {
  protected cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
  }

  protected async fetchMedia(id: string): Promise<string> {
    if (this.cache.has(id)) return this.cache.get(id)!;

    const fetched = (await AttachmentService.getAttachment(
      id,
    )) as GetAttachmentReturn;

    if (!fetched.url) {
      console.error(`Failed to fetch media with id ${id}:`, fetched.error);
      return "";
    }

    this.cache.set(fetched.id, fetched.url as string);
    return fetched.url as string;
  }

  public cleanup(): void {
    this.cache.forEach((url) => URL.revokeObjectURL(url));
    this.cache.clear();
  }

  abstract process(doc: Document): Promise<Document>;
}
