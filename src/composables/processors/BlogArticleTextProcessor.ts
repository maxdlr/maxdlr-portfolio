import { marked } from "marked";
import _ from "lodash";
import { codeToHtml } from "shiki";
import { VideoProcessor } from "./VideoProcessor.ts";
import { ImgProcessor } from "./ImgProcessor.ts";
import { Utils } from "../Utils.ts";

export class BlogArticleTextProcessor {
  private blogArticleText: string;
  private readonly doc: Document;
  private parser: DOMParser;
  private videoProcessor: VideoProcessor;
  private imageProcessor: ImgProcessor;

  constructor(blogArticleText: string) {
    this.blogArticleText = marked(blogArticleText) as string;
    console.log(this.blogArticleText);
    this.parser = new DOMParser();
    this.doc = this.parser.parseFromString(this.blogArticleText, "text/html");
    this.videoProcessor = new VideoProcessor();
    this.imageProcessor = new ImgProcessor();
  }

  public async process(): Promise<string> {
    this.removeBackSlashes();
    this.editAs();
    this.editAnchorLinks();

    await this.editCodeBlocks();
    const processedVideoDoc = await this.videoProcessor.process(this.doc);

    this.blogArticleText = processedVideoDoc.body.innerHTML;
    this.editClasses();
    this.editHr();

    const processedImgDoc = await this.imageProcessor.process(this.doc);
    this.blogArticleText = processedImgDoc.body.innerHTML;
    this.editLineBreak();
    // this.editNotices();
    return this.blogArticleText;
  }

  // public editNotices() {
  //   const ps = this.doc.getElementsByTagName("p");
  //   const infoNotices = [];
  //   const tipNotices = [];
  //   const warnNotices = [];
  //
  //   for (let p of ps) {
  //     let textContent = "";
  //     if (p.innerText.match(/:::info([^:]*)/)) {
  //
  //
  //       if (!p.nextElementSibling?.innerHTML.match(/:::/)) {
  //         p = p.nextElementSibling as HTMLParagraphElement;
  //       }
  //
  //
  //       infoNotices.push(p);
  //     }
  //   }
  //
  //   console.log(infoNotices);
  // }

  private editAs(): void {
    const as = this.doc.getElementsByTagName("a");
    for (let a of as) {
      a.target = "_blank";
    }
    this.blogArticleText = this.doc.body.innerHTML;
  }

  private editClasses(): void {
    const rules: { [key: string]: string[] } = {
      h1: ["uk-h1", "pt-8"],
      h2: ["uk-h2", "pt-5"],
      h3: ["uk-h3", "pt-3"],
      p: ["pt-3", "mt-1"],
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
    const ps = this.doc.getElementsByTagName("p");
    for (let p of ps) {
      if (p.innerText.match(/^\\$/g)) {
        p.remove();
      }
    }
    this.blogArticleText = this.doc.body.innerHTML;
  }

  private editLineBreak(): void {
    this.blogArticleText = Utils.nl2br(this.doc.body.innerHTML);
  }

  private editHr(): void {
    const hrs = this.doc.getElementsByTagName("hr");

    for (let hr of hrs) {
      const img = this.doc.createElement("img");
      ["uk-icon-image", "w-7", "h-7", "m-auto"].forEach((className) =>
        img.classList.add(className),
      );
      img.src = "/logo.png";
      img.alt = "Maxime de la Rocheterie - FullStack Developer logo";

      const div = this.doc.createElement("div");
      ["uk-divider-icon", "text-center", "my-5"].forEach((className) =>
        div.classList.add(className),
      );
      div.append(img);

      hr.replaceWith(div);
    }

    this.blogArticleText = this.doc.body.innerHTML;
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
