// Words shared by the import page and the link builder: the names of the
// dialog's sections and fields as ThinkWatch Lite writes them, and the reasons a
// link is rejected. `{p}` in a problem is the parameter, written with `param`
// or, for a name that is not short and plain, `someParam`. `{v}` in
// `needsVersion` is the version.
import { microsText, type Limit, type Problem } from "./import-link";

export function importLinkText(zh: boolean) {
  return zh
    ? {
        groups: {
          service: "服务类型",
          connection: "连接",
          account: "账号",
          advanced: "高级设置",
          models: "模型",
          billing: "计费",
        },
        labels: {
          service: "服务类型",
          auth: "认证方式",
          site: "站点",
          name: "名称",
          url: "接口地址",
          protocol: "接口协议",
          region: "区域",
          key: "API 密钥",
          oauthEndpoint: "Token 端点",
          oauthRefresh: "Refresh Token",
          oauthClientId: "Client ID",
          oauthClientSecret: "Client Secret",
          awsKeyId: "访问密钥 ID",
          awsSecret: "私有访问密钥",
          awsToken: "会话令牌",
          headers: "请求头",
          clientIdentity: "转发客户端身份",
          concurrency: "并发上限",
          limits: "用量上限",
          balance: "余额来源",
          models: "手动添加的模型",
          modelsOnly: "启用范围",
          specs: "模型规格",
          billing: "计费方式",
          priceSheet: "价目表",
          priceMultiplier: "价目表倍率",
          prices: "模型单价",
        },
        services: {
          anthropic: "Anthropic",
          openai: "OpenAI",
          gemini: "Google Gemini",
          deepseek: "DeepSeek",
          zai: "Z.ai / BigModel",
          bedrock: "Amazon Bedrock",
          openrouter: "OpenRouter",
          thinkwatch: "ThinkWatch 企业网关",
          sub2api: "Sub2API",
          newapi: "New API / One API",
          ollama: "Ollama",
          custom: "自定义",
        },
        auths: { key: "API 密钥", oauth: "OAuth", "aws-keys": "访问密钥", account: "账号登录", chatgpt: "ChatGPT 账号" },
        sites: { bigmodel: "BigModel（中国大陆）", zai: "Z.ai（国际）" },
        balances: {
          off: "不读取",
          openrouter: "OpenRouter",
          deepseek: "DeepSeek",
          moonshot: "Moonshot",
          sub2api: "Sub2API",
          newapi: "New API",
          thinkwatch: "ThinkWatch",
        },
        billings: { "per-token": "按量计费", free: "不计费" },
        // A usage limit read as a phrase, as ThinkWatch Lite writes it: 「每 5 分钟 10,000,000 token」
        limit: {
          units: { minute: "分钟", hour: "小时", day: "天", week: "周", month: "月" },
          unitsMany: { minute: "分钟", hour: "小时", day: "天", week: "周", month: "月" },
          span: " {n} {unit}",
          requests: "每{per} {n} 次请求",
          tokens: "每{per} {n} token",
          cost: "每{per} {n} 费用",
          cacheReads: "（含缓存读取）",
        },
        needsVersion: "需要 ThinkWatch Lite {v} 或更高版本。",
        param: "参数「{name}」",
        someParam: "某个参数",
        problems: {
          empty: "链接中没有参数。",
          tooLong: "链接过长。",
          malformed: "链接的编码不正确。",
          duplicateParam: "链接中{p}出现了多次。",
          emptyValue: "链接中{p}的值为空。",
          neverAccepted: "链接中的{p}属于导入链接不能设置的内容。",
          invalid: "{p}的值不符合要求。",
          notApplicable: "{p}不适用于此服务类型或认证方式。",
          mismatch: "{p}的值与 ThinkWatch Lite 为此服务填写的值不一致。",
          missing: "此服务类型或认证方式须提供{p}。",
        } satisfies Record<Problem, string>,
      }
    : {
        groups: {
          service: "Service",
          connection: "Connection",
          account: "Account",
          advanced: "Advanced settings",
          models: "Models",
          billing: "Billing",
        },
        labels: {
          service: "Service",
          auth: "Authentication",
          site: "Site",
          name: "Name",
          url: "Base URL",
          protocol: "Protocol",
          region: "Region",
          key: "API key",
          oauthEndpoint: "Token endpoint",
          oauthRefresh: "Refresh token",
          oauthClientId: "Client ID",
          oauthClientSecret: "Client secret",
          awsKeyId: "Access key ID",
          awsSecret: "Secret access key",
          awsToken: "Session token",
          headers: "Headers",
          clientIdentity: "Forward client identity",
          concurrency: "Concurrency limit",
          limits: "Usage limits",
          balance: "Balance source",
          models: "Models added by hand",
          modelsOnly: "Enabled models",
          specs: "Model specs",
          billing: "Billing",
          priceSheet: "Price sheet",
          priceMultiplier: "Price multiplier",
          prices: "Model prices",
        },
        services: {
          anthropic: "Anthropic",
          openai: "OpenAI",
          gemini: "Google Gemini",
          deepseek: "DeepSeek",
          zai: "Z.ai / BigModel",
          bedrock: "Amazon Bedrock",
          openrouter: "OpenRouter",
          thinkwatch: "ThinkWatch enterprise gateway",
          sub2api: "Sub2API",
          newapi: "New API / One API",
          ollama: "Ollama",
          custom: "Custom",
        },
        auths: {
          key: "API key",
          oauth: "OAuth",
          "aws-keys": "Access keys",
          account: "Account sign-in",
          chatgpt: "ChatGPT account",
        },
        sites: { bigmodel: "BigModel (mainland China)", zai: "Z.ai (international)" },
        balances: {
          off: "Not read",
          openrouter: "OpenRouter",
          deepseek: "DeepSeek",
          moonshot: "Moonshot",
          sub2api: "Sub2API",
          newapi: "New API",
          thinkwatch: "ThinkWatch",
        },
        billings: { "per-token": "Per token", free: "Free" },
        limit: {
          units: { minute: "minute", hour: "hour", day: "day", week: "week", month: "month" },
          unitsMany: { minute: "minutes", hour: "hours", day: "days", week: "weeks", month: "months" },
          span: "{n} {unit}",
          requests: "{n} requests per {per}",
          tokens: "{n} tokens per {per}",
          cost: "{n} per {per}",
          cacheReads: " (cache reads included)",
        },
        needsVersion: "Needs ThinkWatch Lite {v} or later.",
        param: "the parameter “{name}”",
        someParam: "a parameter",
        problems: {
          empty: "The link has no parameters.",
          tooLong: "The link is too long.",
          malformed: "The link is not encoded correctly.",
          duplicateParam: "The link contains {p} more than once.",
          emptyValue: "The link gives {p} an empty value.",
          neverAccepted: "The link contains {p}, which sets something an import link can never set.",
          invalid: "The value of {p} is not accepted.",
          notApplicable: "The link contains {p}, which does not apply to this service or authentication method.",
          mismatch: "The value of {p} differs from what ThinkWatch Lite fills in for this service.",
          missing: "This service or authentication method needs {p}.",
        } satisfies Record<Problem, string>,
      };
}

export type ImportLinkText = ReturnType<typeof importLinkText>;

/** A usage limit as a phrase: 「每 5 分钟 10,000,000 token」, "$5.00 per day". */
export function limitPhrase(t: ImportLinkText["limit"], l: Limit): string {
  const per = l.every > 1 ? t.span.replace("{n}", String(l.every)).replace("{unit}", t.unitsMany[l.per]) : t.units[l.per];
  const n = l.measure === "cost" ? `$${dollars(l.max)}` : l.max.toLocaleString("en-US");
  const phrase = t[l.measure].replace("{per}", per).replace("{n}", n);
  return l.cacheReads ? phrase + t.cacheReads : phrase;
}

/** Millionths of a dollar with at least two decimals: 5.00, 0.125. */
function dollars(micros: number): string {
  const text = microsText(micros);
  const [whole, frac = ""] = text.split(".");
  return `${Number(whole).toLocaleString("en-US")}.${frac.padEnd(2, "0")}`;
}
