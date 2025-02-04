import { marked } from "marked";
import _ from "lodash";

export class BlogArticleTextProcessor {
  private blogArticleText: string;

  constructor(blogArticleText: string) {
    this.blogArticleText = marked(blogArticleText) as string;
  }

  public process = (): string => {
    this.removeBackSlashes();
    this.editAs();
    this.editLineBreak();
    this.editAnchorLinks();
    this.addAnchorIdsToHs();
    this.editClasses();
    this.editHr();
    return this.blogArticleText;
  };

  private editAs(): void {
    this.blogArticleText = this.blogArticleText.replace(
      /<a href/g,
      "<a target='_blank' href",
    );
  }

  private editClasses(): void {
    const rules: { [key: string]: string[] } = {
      h1: ["uk-h1", "pt-10"],
      h2: ["uk-h2", "pt-8"],
      h3: ["uk-h3", "pt-5"],
      p: ["uk-paragraph", "mt-1"],
      ul: ["uk-list", "uk-list-bullet", "mt-6"],
      li: ["mt-3"],
      img: [
        "rounded-2xl",
        "h-[350px]",
        "w-[350px]",
        "mx-auto",
        "transition-opacity",
        "will-change-opacity",
      ],
      a: ["uk-link", "hover:text-gray-400"],
    };
    for (const key in rules) {
      this.blogArticleText = this.addClassesToHtmlTags(key, rules[key]);
    }
  }

  private removeBackSlashes(): void {
    this.blogArticleText = this.blogArticleText.replace(/\\/g, "");
  }

  private editLineBreak(): void {
    this.blogArticleText = this.blogArticleText.replace(/\\n/g, "<br/>");
  }

  private editHr(): void {
    this.blogArticleText = this.blogArticleText.replace(
      /<hr>/g,
      `
<div class='uk-divider-icon text-center'>
  <img
    class="uk-icon-image w-7 h-7 m-auto"
    src="/logo.png"
    alt="Maxime de la Rocheterie - FullStack Developer logo"
  />
</div>
`,
    );
  }

  private editAnchorLinks(): void {
    this.blogArticleText = this.blogArticleText.replace(
      /<a\s+[^>]*href="(https:\/\/docs\.maxdlr\.com\/doc[^"#]*#h-[^"]*)"[^>]*>(.*?)<\/a>/g,
      (match, href) => {
        const newHref = href.split("#")[1];
        return match
          .replace(href, "#" + newHref)
          .replace("target='_blank'", "");
      },
    );
  }

  private addClassesToHtmlTags(
    htmlTagTarget: string,
    classes: string[],
  ): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.blogArticleText, "text/html");
    const elements = doc.querySelectorAll(htmlTagTarget);

    elements.forEach((element) => {
      classes.forEach((className) => {
        if (element.classList.contains(className)) return;
        element.classList.add(className);
      });
    });
    return doc.body.innerHTML;
  }

  private addAnchorIdsToHs(): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.blogArticleText, "text/html");
    const elements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    elements.forEach((element) => {
      element.id =
        "h-" + _.kebabCase(_.lowerCase(element.textContent as string));
    });

    this.blogArticleText = doc.body.innerHTML;
  }
}
