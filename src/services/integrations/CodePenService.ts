const embedCode = `
<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="Wbeaxmw" data-pen-title="grid of boxes" data-user="maxdlr" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/maxdlr/pen/Wbeaxmw">
  grid of boxes</a> by maxdlr (<a href="https://codepen.io/maxdlr">@maxdlr</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>
`;

export const getCodePenEmbed = (link: string): HTMLElement => {
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
