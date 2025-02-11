import { OutlineService } from "./OutlineService.ts";

export interface GetAttachmentReturn {
  id: string;
  attachments?: Blob;
  url?: string;
  error?: Error;
}

const getAttachment = async (id: string): Promise<GetAttachmentReturn> => {
  try {
    const fetched = await OutlineService.outlineFetch(`/attachments.redirect`)
      .post({
        id: id,
      })
      .json();

    const blob = await fetched.response.value?.blob();
    const imageUrl = URL.createObjectURL(blob as Blob);

    return {
      id: id,
      attachments: blob,
      url: imageUrl,
    };
  } catch (error: any) {
    return {
      id: id,
      error: error as Error,
    };
  }
};

export const AttachmentService = {
  getAttachment,
};
