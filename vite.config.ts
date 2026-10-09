import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { PUBLIC_PAGES, renderMetaTags } from "./src/seo/pages";

const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;

/**
 * Social crawlers (Facebook, WhatsApp, X, LinkedIn, Slack) don't run
 * JavaScript, so each public page gets its own HTML shell with the right
 * title/description/Open Graph tags baked in. vercel.json routes /about to
 * about.html etc.; every other path still falls back to index.html.
 */
function staticPageMeta(): Plugin {
  let outDir = "dist";

  return {
    name: "static-page-meta",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      const template = await readFile(indexPath, "utf8");

      if (!SEO_BLOCK.test(template)) {
        throw new Error("index.html is missing the <!-- seo:start --> block");
      }

      const render = (meta: (typeof PUBLIC_PAGES)[keyof typeof PUBLIC_PAGES]) =>
        template.replace(
          SEO_BLOCK,
          `<!-- seo:start -->\n    ${renderMetaTags(meta)}\n    <!-- seo:end -->`,
        );

      await writeFile(indexPath, render(PUBLIC_PAGES.home));

      for (const meta of Object.values(PUBLIC_PAGES)) {
        if (meta.path === "/") continue;
        await writeFile(path.join(outDir, `${meta.path.slice(1)}.html`), render(meta));
      }
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), staticPageMeta()],
});
