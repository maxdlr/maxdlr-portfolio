import { marked } from "marked";
import _ from "lodash";
import { codeToHtml } from "shiki";
import { VideoProcessor } from "./VideoProcessor.ts";
import { ImgProcessor } from "./ImgProcessor.ts";

export class BlogArticleTextProcessor {
  private blogArticleText: string;
  private readonly doc: Document;
  private parser: DOMParser;
  private videoProcessor: VideoProcessor;
  private imageProcessor: ImgProcessor;

  constructor(blogArticleText: string) {
    this.blogArticleText = marked(blogArticleText) as string;
    this.parser = new DOMParser();
    this.doc = this.parser.parseFromString(this.blogArticleText, "text/html");
    this.videoProcessor = new VideoProcessor();
    this.imageProcessor = new ImgProcessor();
  }

  public process = async (): Promise<string> => {
    this.editAs();
    this.editLineBreak();
    this.editAnchorLinks();
    this.removeBackSlashes();

    await this.editCodeBlocks();
    const processedVideoDoc = await this.videoProcessor.process(this.doc);

    this.blogArticleText = processedVideoDoc.body.innerHTML;
    this.editClasses();
    this.editHr();

    const processedImgDoc = await this.imageProcessor.process(this.doc);
    this.blogArticleText = processedImgDoc.body.innerHTML;

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
      ul: ["uk-list", "uk-list-bullet", "mt-6", "list-disc"],
      ol: ["list-decimal"],
      li: ["mt-3"],
      img: [
        "rounded-xl",
        "h-auto",
        "w-[350px]",
        "mx-auto",
        "transition-opacity",
        "will-change-opacity",
      ],
      a: ["uk-link", "hover:text-gray-400"],
      table: ["uk-table", "uk-table-striped"],
      pre: ["uk-padding", "rounded-xl", "mt-3"],
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

  private addClassesToHtmlTags(
    htmlTagTarget: string,
    classes: string[],
  ): string {
    const elements = this.doc.querySelectorAll(htmlTagTarget);

    elements.forEach((element) => {
      classes.forEach((className) => {
        if (element.classList.contains(className)) return;
        element.classList.add(className);
      });
    });
    return this.doc.body.innerHTML;
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

    const elements = this.doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    elements.forEach((element) => {
      element.id =
        "h-" + _.kebabCase(_.lowerCase(element.textContent as string));
    });

    this.blogArticleText = this.doc.body.innerHTML;
  }

  private async editCodeBlocks() {
    const codeBlocks = this.doc.getElementsByTagName("code");

    for (let codeBlock of codeBlocks) {
      let preBlock = codeBlock.parentNode;
      const language = codeBlock.classList.item(0)?.replace("language-", "");

      if (preBlock?.nodeName === "PRE") {
        const coloredCodeBlock = codeToHtml(codeBlock.innerHTML, {
          lang: language as string,
          theme: "catppuccin-latte",
        });
        (preBlock as Element).replaceWith(
          this.parser.parseFromString(await coloredCodeBlock, "text/html").body
            .firstChild as Node,
        );
      } else {
        ["bg-gray-500", "px-2", "py-1", "text-white", "rounded"].forEach(
          (className) => {
            codeBlock.classList.add(className);
          },
        );
      }
    }
    this.blogArticleText = this.doc.body.innerHTML;
  }
}
