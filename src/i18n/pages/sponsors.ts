// Copy for the /sponsors page, and the sponsor list the Lite page and the
// footer show. A sponsor's tagline and description are its own copy, used as
// supplied (the Chinese is a translation of it); the Lite README (both
// languages) carries the same text, so change both together.

import type { Lang } from "~/i18n";

export interface Sponsor {
  name: string;
  href: string;
  /** A white logo on a transparent background, under public/sponsors */
  logo: string;
  /** The logo's pixel size; it is shown at a third of it or less */
  logoWidth: number;
  logoHeight: number;
}

export const sponsors: Sponsor[] = [
  {
    name: "VoyageAge",
    href: "https://www.voyageage.com",
    logo: "/sponsors/voyageage.png",
    logoWidth: 1200,
    logoHeight: 180,
  },
];

export const sponsorsCopy: Record<Lang, {
  meta: { title: string; description: string; breadcrumbHome: string; breadcrumbPage: string };
  hero: { eyebrow: string; title: string; sub: string };
  entries: Record<string, { tagline: string; body: string; visit: string }>;
  /** contactLabel is the text of the mail link; the address itself is not shown, as in the Lite README */
  become: { title: string; body: string; note: string; contactLabel: string };
  /** Shown at #disclaimer; the Lite README links there. The last paragraph ends with report, a mail link */
  disclaimer: { title: string; body: string[]; report: { lead: string; label: string; end: string } };
}> = {
  en: {
    meta: {
      title: "Sponsors · ThinkWatch Lite",
      description: "The companies that sponsor the development of ThinkWatch Lite, and how to become a sponsor.",
      breadcrumbHome: "Home",
      breadcrumbPage: "Sponsors",
    },
    hero: {
      eyebrow: "ThinkWatch Lite",
      title: "Sponsors",
      sub: "Thanks to the sponsors below for supporting the development of ThinkWatch Lite.",
    },
    entries: {
      VoyageAge: {
        tagline: "One API. More models. Lower costs.",
        body: "VoyageAge brings leading AI models together through one OpenAI-compatible API. Built for developers, teams, and AI startups, it offers competitive pricing and pay-as-you-go billing, making it easier to integrate AI into your projects. Sign up for free trial credits and start building.",
        visit: "Visit voyageage.com",
      },
    },
    become: {
      title: "Become a sponsor",
      body: "Sponsors appear in the ThinkWatch Lite README in English and Chinese, on the ThinkWatch Lite page of this site and on this page.",
      note: "Sponsorship does not affect how ThinkWatch Lite routes, prices or protects requests. The app itself shows no sponsors.",
      contactLabel: "Contact us",
    },
    disclaimer: {
      title: "Disclaimer",
      body: [
        "Sponsors are independent third parties. The ThinkWatch project does not operate, endorse or guarantee their products or services, and is not responsible for their content, availability, pricing, handling of data or conduct. Descriptions of a sponsor on this site and in the README are supplied by the sponsor.",
        "Before using a sponsor's service, review its terms of service and privacy policy. Any agreement for that service is between the user and the sponsor.",
      ],
      report: { lead: "A sponsor found to mislead or harm users is removed. ", label: "Report a problem with a sponsor", end: "." },
    },
  },
  "zh-CN": {
    meta: {
      title: "赞助商 · ThinkWatch Lite",
      description: "赞助 ThinkWatch Lite 开发的公司，以及成为赞助商的方式。",
      breadcrumbHome: "首页",
      breadcrumbPage: "赞助商",
    },
    hero: {
      eyebrow: "ThinkWatch Lite",
      title: "赞助商",
      sub: "感谢以下赞助商支持 ThinkWatch Lite 的开发。",
    },
    entries: {
      VoyageAge: {
        tagline: "一个 API，更多模型，更低成本。",
        body: "VoyageAge 通过一个兼容 OpenAI 的 API 汇集领先的 AI 模型。它面向开发者、团队和 AI 初创公司，价格具有竞争力，按量计费，让你更轻松地把 AI 集成到项目中。注册即可获得免费试用额度，立即开始构建。",
        visit: "访问 voyageage.com",
      },
    },
    become: {
      title: "成为赞助商",
      body: "赞助商展示在 ThinkWatch Lite 的中英文 README、本站 ThinkWatch Lite 页面与本页。",
      note: "赞助不影响 ThinkWatch Lite 对请求的路由、计价与防护；应用内不展示任何赞助商。",
      contactLabel: "联系我们",
    },
    disclaimer: {
      title: "免责声明",
      body: [
        "赞助商是独立的第三方。ThinkWatch 项目不参与其运营，不为其产品或服务背书或担保，对其内容、可用性、价格、数据处理及经营行为不承担责任。本站与 README 中的赞助商介绍由赞助商提供。",
        "使用赞助商的服务前，请阅读其服务条款与隐私政策。与该服务相关的约定存在于用户与赞助商之间。",
      ],
      report: { lead: "赞助商如被发现误导或损害用户，将被撤下。", label: "反馈赞助商的问题", end: "。" },
    },
  },
};
