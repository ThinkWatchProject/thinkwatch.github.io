// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

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
      serialize(item) {
        const url = new URL(item.url);
        const pathname = url.pathname.replace(/\/$/, '') || '/';
        const isHome = pathname === '/' || pathname === '/zh-CN';
        const isDoc = pathname.startsWith('/docs/') || pathname.startsWith('/zh-CN/docs/');
        const isDocsIndex = pathname === '/docs' || pathname === '/zh-CN/docs';
        const isChangelog = pathname === '/changelog' || pathname === '/zh-CN/changelog';

        if (isHome) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (isDocsIndex) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (isDoc) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (isChangelog) {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        } else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }

        item.lastmod = new Date().toISOString();
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
