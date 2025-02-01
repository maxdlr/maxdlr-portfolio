const getReadTime = (text: string, wordsPerMinute: number = 200): number =>
  text.trim().split(/\s+/).length / wordsPerMinute;

export const Utils = {
  getReadTime,
};
