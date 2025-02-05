const getReadTime = (text: string, wordsPerMinute: number = 200): number =>
  text.trim().split(/\s+/).length / wordsPerMinute;
const nl2br = (str: string): string => str.replace(/\\n/g, "<br />");

export const Utils = {
  getReadTime,
  nl2br,
};
