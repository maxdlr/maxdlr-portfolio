const getReadTime = (text: string, wordsPerMinute: number = 200): number =>
  text.trim().split(/\s+/).length / wordsPerMinute;

const styleHtml = (
  text: string,
  htmlTagTarget: string,
  classesToAdd: string,
) => {
  const tagRegex = new RegExp(`<${htmlTagTarget}([^>]*)>`, "g");

  return text.replace(tagRegex, (match, attributes) => {
    if (attributes.includes('class="')) {
      return match.replace('class="', `class="${classesToAdd} `);
    } else if (attributes.trim()) {
      return match.replace(
        `<${htmlTagTarget}`,
        `<${htmlTagTarget} class="${classesToAdd}"`,
      );
    } else {
      return `<${htmlTagTarget} class="${classesToAdd}">`;
    }
  });
};

export const Utils = {
  getReadTime,
  styleHtml,
};
