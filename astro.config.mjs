// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { lastModified, pageReleases, pageSources } from './src/lib/lastmod.ts';
import { getReleases } from './src/lib/github.ts';

/**
 * Wraps every markdown table in a container that scrolls sideways. The page
 * clips horizontal overflow (global.css), so a table wider than a phone screen
 * would otherwise be cut off rather than scroll.
 */
function rehypeScrollingTables() {
  /** @param {any} node */
  const visit = (node) => {
    if (!Array.isArray(node.children)) return;
    node.children = node.children.map((/** @type {any} */ child) => {
      if (child.type === 'element' && child.tagName === 'table') {
        // Focusable, like the code blocks, so that it can be scrolled from the keyboard.
        return { type: 'element', tagName: 'div', properties: { className: ['table-scroll'], tabIndex: 0 }, children: [child] };
      }
      visit(child);
      return child;
    });
  };
  return (/** @type {any} */ tree) => visit(tree);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://thinkwat.ch',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', 'zh-CN': 'zh-CN' },
      },
      filter: (page) => !page.includes('/404'),
      async serialize(item) {
        const url = new URL(item.url);
        const pathname = url.pathname.replace(/\/$/, '') || '/';
        const isHome = pathname === '/' || pathname === '/zh-CN';
        const isDoc = pathname.startsWith('/docs/') || pathname.startsWith('/zh-CN/docs/');
        const isDocsIndex = pathname === '/docs' || pathname === '/zh-CN/docs';
        const isChangelog = pathname === '/changelog' || pathname === '/zh-CN/changelog';
        // Product landing pages: ThinkWatch, ThinkWatch Lite, ThinkWatch Core.
        const productPaths = ['/thinkwatch', '/lite', '/core'];
        const isProduct = productPaths.some((p) => pathname === p || pathname === `/zh-CN${p}`);
        const isLicense = pathname === '/license' || pathname === '/zh-CN/license';

        if (isHome) {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (isProduct) {
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (isDocsIndex) {
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (isDoc) {
          // Includes the product doc sets under /docs/lite/ and /docs/core/.
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (isChangelog) {
          item.priority = 0.7;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (isLicense) {
          item.priority = 0.6;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else {
          item.priority = 0.5;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        }

        // When the page's own files last changed in git, or the latest release
        // of a product the page shows came out, whichever is later. Left out
        // without git history: a release date alone does not say when the
        // page itself last changed.
        const committed = lastModified(pageSources(pathname));
        if (committed) {
          let latest = Date.parse(committed);
          const products = pageReleases(pathname);
          if (products.length) {
            // Newest first: the first match is the latest release among them.
            const release = (await getReleases()).find((r) => products.includes(r.product));
            if (release) latest = Math.max(latest, Date.parse(release.date));
          }
          item.lastmod = new Date(latest).toISOString();
        }
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: false,
    },
    rehypePlugins: [
      rehypeScrollingTables,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['heading-anchor'],
            ariaLabel: 'Link to this section',
          },
          content: {
            type: 'text',
            value: '#',
          },
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Font files are always emitted as files (src/components/Fonts.astro).
      // Vite would otherwise inline those under 4 KB, the smaller Unicode
      // subsets of Geist, into the stylesheet as base64, and every page would
      // download subsets it never uses before its first paint. Anything else
      // keeps the default limit.
      assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined),
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
