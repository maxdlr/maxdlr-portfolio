const getCodePenEmbed = (link: string): HTMLElement => {
  const authorLink = link.split("/pen")[0];
  const embeddedCode = `
<iframe height="300" style="width: 100%;" scrolling="no" title="grid of boxes" frameborder="no" src="${link}" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="${link}">
  grid of boxes</a> by maxdlr (<a href="${authorLink}">@maxdlr</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
`;

  const parser = new DOMParser();
  return <HTMLElement>(
    parser.parseFromString(embeddedCode, "text/html").body.firstChild
  );
};

export const CodePenService = {
  getCodePenEmbed,
};
