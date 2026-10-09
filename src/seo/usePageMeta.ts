import { useEffect } from "react";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  type PageMeta,
} from "./pages";

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = href;
};

/**
 * Keeps <title>, description, canonical, robots, Open Graph and Twitter
 * tags in sync with the current page during client-side navigation.
 */
export function usePageMeta(meta: PageMeta | null) {
  const { title, description, path, image, imageAlt, type, noindex } =
    meta || ({} as Partial<PageMeta>);

  useEffect(() => {
    if (!title || !description || !path) return;

    const url = absoluteUrl(path);
    const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);
    const alt = imageAlt || title;

    document.title = title;
    upsertCanonical(url);
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", type || "website");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:image:alt", alt);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);
    upsertMeta("name", "twitter:image:alt", alt);
  }, [title, description, path, image, imageAlt, type, noindex]);
}

/**
 * Marks private pages (dashboard, admin, checkout, auth) as not indexable.
 */
export function useNoIndex(title = SITE_NAME) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "robots", "noindex, nofollow");
  }, [title]);
}
