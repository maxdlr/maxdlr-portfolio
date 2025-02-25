const getReadTime = (text: string, wordsPerMinute: number = 200): number =>
  text.trim().split(/\s+/).length / wordsPerMinute;
const nl2br = (str: string): string => str.replace(/\\n/g, "<br />");
const unescapeEqualArrow = (str: string): string => str.replace(/=&gt;/g, "=>");
const explodeDateKey = (
  dateKey: string,
): { day: number | null; month: number | null; year: number | null } => {
  let day: number | null = null;
  let month: number | null = null;
  let year: number | null = null;

  const matches = dateKey.match(/(\d+)-(\d+)-(\d+)/);
  if (matches) {
    day = matches[1] ? parseInt(matches[1]) : null;
    month = matches[2] ? parseInt(matches[2]) : null;
    year = matches[2] ? parseInt(matches[3]) : null;
  }

  return {
    day,
    month,
    year,
  };
};

export const Utils = {
  getReadTime,
  nl2br,
  unescapeEqualArrow,
  explodeDateKey,
};
