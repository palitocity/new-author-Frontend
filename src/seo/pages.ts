/**
 * SEO metadata for pages crawlers are allowed to see.
 *
 * Used both at runtime (usePageMeta) and at build time (vite.config.ts writes
 * a pre-rendered HTML shell per page so social crawlers, which don't run JS,
 * still get the right Open Graph tags).
 */

export const SITE_URL = "https://www.sankofaseek.com";
export const SITE_NAME = "SankofaSeek";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_DESCRIPTION =
  "SankofaSeek is a movement to rediscover ancestral stories, symbols and heritage, and carry them forward as tools for healing, creativity and transformation.";

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

export const PUBLIC_PAGES = {
  home: {
    title: "SankofaSeek | Rediscover Ancestral Stories & Heritage",
    description: DEFAULT_DESCRIPTION,
    path: "/",
  },
  about: {
    title: "About Us | SankofaSeek",
    description:
      "Learn about SankofaSeek's mission to preserve cultural memory and turn ancestral wisdom into a compass for the future.",
    path: "/about",
  },
  blog: {
    title: "Blog | SankofaSeek",
    description:
      "Essays, stories and reflections on African heritage, symbols, traditions and the wisdom carried across generations.",
    path: "/blog",
  },
  gallery: {
    title: "Gallery | SankofaSeek",
    description:
      "A visual collection of the people, places, artifacts and moments that shape the SankofaSeek story.",
    path: "/gallery",
  },
  contact: {
    title: "Contact Us | SankofaSeek",
    description:
      "Get in touch with the SankofaSeek team for support, partnerships or questions about our stories and library.",
    path: "/contact",
  },
  terms: {
    title: "Terms & Conditions | SankofaSeek",
    description:
      "The terms that govern your use of SankofaSeek, including purchases and access to our digital library.",
    path: "/terms",
  },
  privacy: {
    title: "Privacy Policy | SankofaSeek",
    description:
      "How SankofaSeek collects, uses and protects your personal information.",
    path: "/privacy",
  },
} satisfies Record<string, PageMeta>;

export const absoluteUrl = (pathOrUrl: string) =>
  /^https?:\/\//i.test(pathOrUrl)
    ? pathOrUrl
    : `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

const escapeAttr = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Static <head> tags for a page. Kept in sync with usePageMeta, which
 * updates the same tags on client-side navigation.
 */
export const renderMetaTags = (meta: PageMeta) => {
  const url = absoluteUrl(meta.path);
  const image = absoluteUrl(meta.image || DEFAULT_OG_IMAGE);
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);
  const imageAlt = escapeAttr(meta.imageAlt || meta.title);
  const robots = meta.noindex ? "noindex, nofollow" : "index, follow";

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${meta.type || "website"}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
  ].join("\n    ");
};
