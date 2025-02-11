import { useHead } from "@unhead/vue";

interface BlogArticleMetadata {
  title: string;
  description: string;
  image: string;
  publishDate: string;
  author: string;
  slug: string;
}

type PageType = "home" | "blog" | "article";

export function usePageHead(
  pageType: PageType,
  blogArticleMetadata?: BlogArticleMetadata,
) {
  const baseUrl = "https://www.maxdlr.com";

  const commonMeta = {
    locale: "fr_FR",
    siteName: "Maxdlr - Developer & Motion designer",
    defaultImage: "/photo.jpg",
    defaultImageWidth: "1200",
    defaultImageHeight: "627",
  };

  const getPageMeta = () => {
    switch (pageType) {
      case "home":
        return {
          title: "Maxdlr - Developer & Motion designer",
          description:
            "Full-Stack developer & Motion designer, from Lyon with Love",
          url: baseUrl,
          image: commonMeta.defaultImage,
          type: "website",
        };

      case "blog":
        return {
          title: "Blog - Maxdlr",
          description:
            "Thoughts and articles about web development, motion design and other things.",
          url: `${baseUrl}/blog`,
          image: "/photo.jpg",
          type: "website",
        };

      case "article":
        if (!blogArticleMetadata)
          throw new Error("Blog data is required for article pages");
        return {
          title: `${blogArticleMetadata.title} - Maxdlr Blog`,
          description: blogArticleMetadata.description,
          url: `${baseUrl}/blog/${blogArticleMetadata.slug}`,
          image: blogArticleMetadata.image,
          type: "article",
          publishDate: blogArticleMetadata.publishDate,
          author: blogArticleMetadata.author,
        };

      default:
        throw new Error("Invalid page type");
    }
  };

  const pageMeta = getPageMeta();

  useHead({
    title: pageMeta.title,
    meta: [
      { name: "description", content: pageMeta.description },
      { name: "robots", content: "index, follow" },

      // Open Graph
      { property: "og:locale", content: commonMeta.locale },
      { property: "og:type", content: pageMeta.type },
      { property: "og:title", content: pageMeta.title },
      { property: "og:description", content: pageMeta.description },
      { property: "og:url", content: pageMeta.url },
      { property: "og:site_name", content: commonMeta.siteName },
      { property: "og:image:secure_url", content: pageMeta.image },
      { property: "og:image", content: pageMeta.image },
      { property: "og:image:width", content: commonMeta.defaultImageWidth },
      { property: "og:image:height", content: commonMeta.defaultImageHeight },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: baseUrl },
      { name: "twitter:title", content: pageMeta.title },
      { name: "twitter:description", content: pageMeta.description },
      { name: "twitter:image", content: pageMeta.image },

      // Article-specific meta tags
      ...(pageType === "article"
        ? [
            {
              property: "article:published_time",
              content: pageMeta.publishDate,
            },
            { property: "article:author", content: pageMeta.author },
          ]
        : []),
    ],
    link: [
      { rel: "icon", href: "/favicon.jpg", type: "image/svg+xml" },
      { rel: "canonical", href: pageMeta.url },
    ],
  });
}
