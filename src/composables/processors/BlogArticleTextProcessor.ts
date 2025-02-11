import { marked } from "marked";
import _ from "lodash";
import { codeToHtml } from "shiki";
import { VideoProcessor } from "./VideoProcessor.ts";
import { ImgProcessor } from "./ImgProcessor.ts";
import { Utils } from "../Utils.ts";
import { getCodePenEmbed } from "../../services/integrations/CodePenService.ts";

export class BlogArticleTextProcessor {
  public articleImageLinks: string[] = [];
  public articleDescription: string = "";

  private blogArticleText: string;
  private readonly doc: Document;
  private parser: DOMParser;
  private videoProcessor: VideoProcessor;
  private imageProcessor: ImgProcessor;

  constructor(blogArticleText: string) {
    marked.use({
      breaks: true,
      gfm: true,
    });
    this.blogArticleText = marked(blogArticleText) as string;
    this.blogArticleText = _.unescape(this.blogArticleText);
    this.parser = new DOMParser();
    this.doc = this.parser.parseFromString(this.blogArticleText, "text/html");
    this.videoProcessor = new VideoProcessor();
    this.imageProcessor = new ImgProcessor();
  }

  public async process(): Promise<string> {
    this.removeBackSlashes();
    this.editAs();
    this.editAnchorLinks();
    this.editNotices();
    await this.editCodeBlocks();

    const processedVideoDoc = await this.videoProcessor.process(this.doc);
    this.blogArticleText = processedVideoDoc.body.innerHTML;

    this.editClasses();
    this.editHr();

    const processedImgDoc = await this.imageProcessor.process(this.doc);
    this.blogArticleText = processedImgDoc.body.innerHTML;
    this.retrieveImageLinks();
    this.buildArticleDescription();

    this.removeBackSlashes();
    this.editLineBreak();
    return this.blogArticleText;
  }

  private retrieveImageLinks() {
    this.articleImageLinks = this.imageProcessor.newImageUrls;
  }

  private buildArticleDescription() {
    const ps = this.doc.getElementsByTagName("p");
    let description = "";
    for (let i = 0; i < 3; i++) {
      description += ps[i]?.textContent ?? "";
      description += "<br/>";
    }
    this.articleDescription = description;
  }

  private editNotices() {
    const ps = this.doc.getElementsByTagName("p");
    const noticePs: HTMLParagraphElement[] = [];

    for (const noticeP of ps) {
      ["info", "warning", "success", "tip"].forEach((type) => {
        if (_.startsWith(noticeP.innerText ?? "", `:::${type}`)) {
          noticeP.classList.add(`${type}-notice`);
          noticeP.textContent = noticeP.textContent?.replace(
            `:::${type}`,
            "",
          ) as string;
          noticePs.push(noticeP);
        }
      });
    }

    noticePs.forEach((noticeP) => {
      const ukIcon = this.doc.createElement("uk-icon");

      ukIcon.setAttribute("height", "20");
      ukIcon.setAttribute("width", "20");

      const icon = this.doc.createElement("span");
      icon.classList.add("size-5");
      icon.append(ukIcon);

      const span = this.doc.createElement("span");
      span.append(icon);

      noticeP.append(span);

      ["info", "warning", "success", "tip"].forEach((type) => {
        if (noticeP.classList.contains(`${type}-notice`)) {
          const iconMap: { [key: string]: string } = {
            info: "info",
            warning: "circle-alert",
            success: "circle-check",
            tip: "circle-dot",
          };

          ukIcon.setAttribute("icon", iconMap[type]);
        }
      });

      [
        "absolute",
        "font-bold",
        "text-white",
        "rounded-full",
        "p-0",
        "-top-2",
        "-start-2",
        "notice-badge",
      ].forEach((className) => span.classList.add(className));

      ["notice", "relative"].forEach((className) =>
        noticeP.classList.add(className),
      );
    });

    for (const p of ps) {
      if (p.innerText === ":::") p.remove();
    }

    this.blogArticleText = this.doc.body.innerHTML;
  }

  private editAs(): void {
    const as = this.doc.getElementsByTagName("a");
    for (const a of as) {
      a.target = "_blank";
    }
    this.blogArticleText = this.doc.body.innerHTML;
  }

  private editClasses(): void {
    const rules: { [key: string]: string[] } = {
      h1: ["uk-h1", "pt-8"],
      h2: ["uk-h2", "pt-5"],
      h3: ["uk-h3", "pt-3"],
      p: ["pt-3", "indent-3"],
      "blockquote p": ["indent-0", "pt-0"],
      ul: ["uk-list", "uk-list-bullet", "mt-6", "list-disc"],
      ol: ["list-decimal", "ps-10"],
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
      blockquote: [
        "p-4",
        "my-4",
        "border-s-4",
        "border-gray-300",
        "bg-gray-100",
        "rounded-e-2xl",
      ],
      ".tip-notice": ["bg-yellow-100", "border-t-2", "border-yellow-500"],
      ".info-notice": ["bg-blue-100", "border-t-2", "border-blue-500"],
      ".success-notice": ["bg-green-100", "border-t-2", "border-green-500"],
      ".warning-notice": ["bg-red-100", "border-t-2", "border-red-500"],
      ".notice": ["uk-padding", "rounded-lg", "mt-5"],
      ".tip-notice .notice-badge": ["bg-yellow-500"],
      ".info-notice .notice-badge": ["bg-blue-500"],
      ".warning-notice .notice-badge": ["bg-red-500"],
      ".success-notice .notice-badge": ["bg-green-500"],
    };
    for (const key in rules) {
      this.blogArticleText = this.addClassesToHtmlTags(key, rules[key]);
    }
  }

  private removeBackSlashes(): void {
    const ps = this.doc.getElementsByTagName("p");
    for (const p of ps) {
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

    for (const hr of hrs) {
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

    for (const codeBlock of codeBlocks) {
      const preBlock = codeBlock.parentNode;
      const language = codeBlock.classList.item(0)?.replace("language-", "");

      if (preBlock?.nodeName === "PRE") {
        const coloredCodeBlock = codeToHtml(codeBlock.innerHTML, {
          lang: language as string,
          theme: "catppuccin-latte",
        });

        const highlightedCodeNode = this.parser.parseFromString(
          await coloredCodeBlock,
          "text/html",
        ).body.firstChild as Node;

        (preBlock as Element).replaceWith(highlightedCodeNode);
      } else {
        [
          "bg-gray-500",
          "px-2",
          "py-1",
          "text-white",
          "rounded",
          "text-sm",
        ].forEach((className) => {
          codeBlock.classList.add(className);
        });
      }
    }
    this.blogArticleText = this.doc.body.innerHTML;
  }

  private editCopePen() {
    const as = this.doc.getElementsByTagName("a");

    for (const a of as) {
      if (a.href.includes("codepen.io")) {
        a.replaceWith(getCodePenEmbed(a.href));
        break;
      }
    }

    this.blogArticleText = this.doc.body.innerHTML;
  }
}
