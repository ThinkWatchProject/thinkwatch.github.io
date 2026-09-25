// Copy for the /changelog page, which lists the releases of all three products.

export const changelogCopy = {
  en: {
    meta: {
      title: "ThinkWatch release notes · Changelog",
      description:
        "Release notes for each version of ThinkWatch Enterprise, ThinkWatch Lite and ThinkWatch Core, listed from newest to oldest.",
      breadcrumbHome: "Home",
      breadcrumbPage: "Changelog",
    },
    eyebrow: "Changelog",
    titleA: "ThinkWatch ",
    titleHighlight: "release notes",
    intro:
      "Release notes for each version of ThinkWatch Enterprise, ThinkWatch Lite and ThinkWatch Core, listed from newest to oldest. Subscribe via ",
    rss: "RSS",
    introEnd: ".",
    filterLabel: "Filter release notes by product",
    all: "All",
    filters: { enterprise: "Enterprise", lite: "Lite", core: "Core" },
    github: "View on GitHub",
    linkTo: "Link to",
    dateLocale: "en-US",
    dateFormat: { year: "numeric", month: "short", day: "numeric" },
  },
  "zh-CN": {
    meta: {
      title: "ThinkWatch 发布说明 · 更新日志",
      description: "ThinkWatch 企业版、ThinkWatch Lite 与 ThinkWatch Core 各版本的发布说明，按时间倒序排列。",
      breadcrumbHome: "首页",
      breadcrumbPage: "更新日志",
    },
    eyebrow: "更新日志",
    titleA: "ThinkWatch ",
    titleHighlight: "发布说明",
    intro: "ThinkWatch 企业版、ThinkWatch Lite 与 ThinkWatch Core 各版本的发布说明，按时间倒序排列。可通过 ",
    rss: "RSS",
    introEnd: " 订阅。",
    filterLabel: "按产品筛选发布说明",
    all: "全部",
    filters: { enterprise: "企业版", lite: "Lite", core: "Core" },
    github: "在 GitHub 上查看",
    linkTo: "链接到",
    dateLocale: "zh-CN",
    dateFormat: { year: "numeric", month: "long", day: "numeric" },
  },
} as const;
