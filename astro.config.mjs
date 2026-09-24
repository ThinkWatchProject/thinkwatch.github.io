// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { lastModified, pageReleases, pageSources } from './src/lib/lastmod.ts';
import { getReleases } from './src/lib/github.ts';

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
        // when unknown.
        const dates = [lastModified(pageSources(pathname))];
        const products = pageReleases(pathname);
        if (products.length) {
          // Newest first: the first match is the latest release among them.
          dates.push((await getReleases()).find((r) => products.includes(r.product))?.date);
        }
        const times = dates.flatMap((d) => (d ? [Date.parse(d)] : []));
        if (times.length) item.lastmod = new Date(Math.max(...times)).toISOString();
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
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
