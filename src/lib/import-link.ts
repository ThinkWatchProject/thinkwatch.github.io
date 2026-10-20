// Import links for ThinkWatch Lite: `thinkwatch://import?…` and its web form
// `https://thinkwat.ch/import#…`. A relay, a vendor or a ThinkWatch Enterprise
// console hands one out to open the New upstream dialog in the app, prefilled.
//
// Version 2 of the link can set what the New upstream dialog lets a user set,
// for each service type, and nothing the dialog does not show for that service
// and authentication method. The rules mirror the app's parser
// (src-tauri/src/import_link.rs) and its presets (src/upstreams/presets.ts and
// upstreamForm.ts) in the Lite repository. The app validates every link again
// and is the authority; this copy lets the web page and the link builder reject
// a bad link before handing it on.
//
// Every value is treated as hostile: any web page can produce a link.

export const SERVICES = [
  "anthropic",
  "openai",
  "gemini",
  "deepseek",
  "zai",
  "bedrock",
  "openrouter",
  "thinkwatch",
  "sub2api",
  "newapi",
  "ollama",
  "custom",
] as const;
export type Service = (typeof SERVICES)[number];

export const AUTHS = ["key", "oauth", "account", "aws-keys"] as const;
export type Auth = (typeof AUTHS)[number];

export const SITES = ["bigmodel", "zai"] as const;
export type Site = (typeof SITES)[number];

export const PROTOCOLS = ["anthropic", "openai-chat", "openai-responses", "gemini"] as const;
export type Protocol = (typeof PROTOCOLS)[number];

export const BALANCES = ["off", "openrouter", "deepseek", "moonshot", "sub2api", "newapi", "thinkwatch"] as const;
export type Balance = (typeof BALANCES)[number];

export const BILLINGS = ["per-token", "free"] as const;
export type Billing = (typeof BILLINGS)[number];

export const LIMIT_PERS = ["minute", "hour", "day", "week", "month"] as const;
export type LimitPer = (typeof LIMIT_PERS)[number];

export const LIMIT_MEASURES = ["requests", "tokens", "cost"] as const;
export type LimitMeasure = (typeof LIMIT_MEASURES)[number];

/** Every parameter, in the order a link is written. */
export const PARAMS = [
  "service",
  "auth",
  "site",
  "name",
  "url",
  "protocol",
  "key",
  "oauth_endpoint",
  "oauth_refresh",
  "oauth_client_id",
  "oauth_client_secret",
  "region",
  "aws_access_key_id",
  "aws_secret_access_key",
  "aws_session_token",
  "headers",
  "client_identity",
  "concurrency",
  "limits",
  "balance",
  "models",
  "models_only",
  "specs",
  "billing",
  "price_multiplier",
  "prices",
] as const;
export type Param = (typeof PARAMS)[number];

/** The parameters of the first version. A link with only these also opens in earlier versions of the app. */
export const V1_PARAMS: readonly Param[] = ["name", "url", "protocol", "key", "models"];

/** The first version of ThinkWatch Lite that reads the other parameters, unless `SINCE` names a later one. */
export const V2_SINCE = "2026.10.16";

/** Parameters added after V2_SINCE, with the first version of ThinkWatch Lite that reads them. */
export const SINCE: Partial<Record<Param, string>> = { limits: "2026.10.26" };

/** Compares two versions such as 2026.10.16, part by part. */
const newer = (a: string, b: string) => {
  const x = a.split(".").map(Number);
  const y = b.split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) > (y[i] ?? 0);
  }
  return false;
};

/** The first version of ThinkWatch Lite that reads all of these parameters, or undefined when every version does. */
export function sinceOf(params: readonly Param[]): string | undefined {
  let since: string | undefined;
  for (const p of params) {
    if (V1_PARAMS.includes(p)) continue;
    const v = SINCE[p] ?? V2_SINCE;
    if (!since || newer(v, since)) since = v;
  }
  return since;
}

/**
 * Settings a link can never carry: the outbound proxy and what happens when it is
 * unavailable, an AWS profile, aliases, routes, the default upstream, weights, the
 * disabled switch and the OAuth access token used only for checking. A link naming
 * one is rejected, not taken for a parameter of a newer version.
 */
export const NEVER = [
  "proxy",
  "on_proxy_fail",
  "aws_profile",
  "alias",
  "aliases",
  "route",
  "routes",
  "default",
  "weight",
  "disabled",
  "oauth_access",
] as const;

export const MAX_LINK = 8192;
export const MAX_NAME = 64;
export const MAX_URL = 2048;
export const MAX_KEY = 512;
export const MAX_LONG_SECRET = 4096;
export const MAX_MODEL = 128;
export const MAX_MODELS = 64;
export const MAX_HEADERS = 16;
export const MAX_HEADER_NAME = 64;
export const MAX_HEADER_VALUE = 1024;
export const MAX_CONCURRENCY = 1000;
export const MAX_LIMITS = 16;
/** The largest request or token count of a usage limit (fifteen digits) */
export const MAX_LIMIT_COUNT = 999_999_999_999_999;
/** The smallest cost limit, in millionths of a dollar ($0.01) */
export const LIMIT_COST_MIN = 10_000;
export const MAX_SPEC_TOKENS = 10_000_000;

const APP_PREFIX = "thinkwatch://import?";
const LF = String.fromCharCode(10);

/** Z.ai / BigModel: the site decides the address. */
export const ZAI_ADDRESS: Record<Site, string> = {
  zai: "https://api.z.ai/api/anthropic",
  bigmodel: "https://open.bigmodel.cn/api/anthropic",
};

const BEDROCK_HOST = /^bedrock-runtime(?:-fips)?\.([a-z0-9-]+)\.amazonaws\.com$/;
export const bedrockAddress = (region: string) => `https://bedrock-runtime.${region}.amazonaws.com`;
export const DEFAULT_BEDROCK_REGION = "us-east-1";

/**
 * What the New upstream dialog asks for each service (Lite: `PRESETS`, `fieldRules`).
 *
 * - `url`: `required` — the dialog has no address of its own; `own` — the service has
 *   one, and a `url` in the link must equal it; `any` — optional, any address
 *   (Bedrock: an endpoint such as a VPC endpoint; Ollama: another machine).
 * - `protocol`: the choices the dialog offers, or the one it fills in by itself
 *   (a link may only repeat it), or null where no protocol value can be written.
 */
type ServiceRules = {
  auth: readonly Auth[];
  url: "required" | "own" | "any";
  address?: string;
  protocol: readonly Protocol[] | Protocol | null;
  key: boolean;
  clientIdentity: boolean;
  billing: Billing;
};

const base = { auth: ["key"], key: true, clientIdentity: false, billing: "per-token" } as const;

export const SERVICE_RULES: Record<Service, ServiceRules> = {
  anthropic: { ...base, url: "own", address: "https://api.anthropic.com", protocol: "anthropic" },
  openai: {
    ...base,
    auth: ["key", "account"],
    url: "own",
    address: "https://api.openai.com",
    protocol: ["openai-chat", "openai-responses"],
  },
  gemini: { ...base, url: "own", address: "https://generativelanguage.googleapis.com", protocol: "gemini" },
  deepseek: { ...base, url: "own", address: "https://api.deepseek.com/anthropic", protocol: "anthropic" },
  zai: { ...base, auth: ["key", "account"], url: "own", protocol: "anthropic" },
  bedrock: { ...base, auth: ["key", "aws-keys"], url: "any", protocol: null },
  openrouter: { ...base, url: "own", address: "https://openrouter.ai/api", protocol: "openai-chat" },
  thinkwatch: { ...base, url: "required", protocol: null },
  sub2api: { ...base, url: "required", protocol: PROTOCOLS, clientIdentity: true },
  newapi: { ...base, url: "required", protocol: PROTOCOLS, clientIdentity: true },
  ollama: { ...base, url: "any", address: "http://127.0.0.1:11434", protocol: "openai-chat", key: false, billing: "free" },
  custom: { ...base, auth: ["key", "oauth"], url: "required", protocol: PROTOCOLS, clientIdentity: true },
};

/** Official hosts, recognized by host alone, the way the app's edit dialog recognizes an address. */
const HOSTS: Record<string, Service> = {
  "api.anthropic.com": "anthropic",
  "api.openai.com": "openai",
  "generativelanguage.googleapis.com": "gemini",
  "api.deepseek.com": "deepseek",
  "openrouter.ai": "openrouter",
  "api.z.ai": "zai",
  "open.bigmodel.cn": "zai",
};

/** The service of a link without `service`: from the address, falling back to custom. */
export function serviceOfUrl(url: string): Service {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return "custom";
  }
  const host = u.hostname.toLowerCase();
  const known = HOSTS[host];
  if (known) return known;
  if (BEDROCK_HOST.test(host)) return "bedrock";
  if (u.port === "11434") return "ollama";
  return "custom";
}

/** The fields the New upstream dialog shows (or fills in) for a service and authentication method. */
export function fieldsFor(service: Service, auth: Auth): Set<Param> {
  const r = SERVICE_RULES[service];
  const f = new Set<Param>(["service", "auth", "name", "models", "models_only", "specs", "billing", "price_multiplier", "prices"]);
  if (service === "zai") f.add("site");
  if (service === "bedrock") f.add("region");
  if (auth === "account") return f;
  if (service === "custom") f.add("balance");
  f.add("url");
  f.add("headers");
  f.add("concurrency");
  f.add("limits");
  if (r.protocol !== null) f.add("protocol");
  if (r.clientIdentity) f.add("client_identity");
  if (auth === "key" && r.key) f.add("key");
  if (auth === "oauth") {
    for (const p of ["oauth_endpoint", "oauth_refresh", "oauth_client_id", "oauth_client_secret"] as const) f.add(p);
  }
  if (auth === "aws-keys") {
    for (const p of ["aws_access_key_id", "aws_secret_access_key", "aws_session_token"] as const) f.add(p);
  }
  return f;
}

export type Header = { name: string; value: string };
export type Spec = {
  model: string;
  context?: number;
  maxOutput?: number;
  reasoning?: boolean;
  image?: boolean;
};
/** USD per million tokens, as written in the link. An omitted cache price is the input price. */
export type Price = {
  model: string;
  input: string;
  output: string;
  cacheRead: string;
  cacheWrite5m: string;
  cacheWrite1h: string;
};

/**
 * A usage limit: at most `max` requests, tokens or millionths of a dollar per
 * `every` minutes or hours, or per day, week or month.
 */
export type Limit = {
  per: LimitPer;
  /** Minutes or hours the window spans; 1 for a day, week or month */
  every: number;
  measure: LimitMeasure;
  /** A count, or for cost millionths of a dollar */
  max: number;
  cacheReads: boolean;
};

/** A validated import: what the New upstream dialog is prefilled with. */
export type ImportLink = {
  service: Service;
  /** Recognized from `url` because the link has no `service` */
  recognized: boolean;
  auth: Auth;
  /** Z.ai / BigModel only */
  site?: Site;
  name?: string;
  /** Where requests and the key go: the link's `url` or the service's own address. Absent for an account sign-in. */
  address?: string;
  /** The receiving hosts, in ASCII, with the port when there is one: the address, then the token endpoint when it differs */
  hosts: string[];
  /** Those of `hosts` reached over plain http, other than this computer */
  plainHosts: string[];
  protocol?: Protocol;
  region?: string;
  key?: string;
  oauth?: { endpoint: string; refresh: string; clientId?: string; clientSecret?: string };
  aws?: { accessKeyId: string; secretAccessKey: string; sessionToken?: string };
  headers: Header[];
  clientIdentity: boolean;
  concurrency?: number;
  limits: Limit[];
  balance?: Balance;
  models: string[];
  modelsOnly?: string[];
  specs: Spec[];
  /** As given; absent means the service's default */
  billing?: Billing;
  /** Present when the link makes a new price sheet */
  priceSheet?: { multiplier: string; prices: Price[] };
  /** The first version of ThinkWatch Lite that reads every parameter; absent when the first version's parameters suffice */
  since?: string;
  /** The checked parameters, normalized, in link order: what the app is handed */
  params: [Param, string][];
};

export type Problem =
  | "empty"
  | "tooLong"
  | "malformed"
  | "duplicateParam"
  | "emptyValue"
  | "neverAccepted"
  | "invalid"
  | "notApplicable"
  | "mismatch"
  | "missing";

/**
 * `unknown`: parameters this copy of the rules does not know. A newer app may read
 * them, so the link is not rejected for them; the page says a newer ThinkWatch Lite
 * is needed and still offers to open it.
 */
export type Result =
  | { ok: true; link: ImportLink; unknown: [string, string][] }
  | { ok: false; problem: Problem; param?: string };

// Zero-width and direction-changing characters, and the replacement character:
// the same set as the app's `invisible`.
const INVISIBLE: [number, number][] = [
  [0x00ad, 0x00ad],
  [0x034f, 0x034f],
  [0x061c, 0x061c],
  [0x115f, 0x1160],
  [0x17b4, 0x17b5],
  [0x180b, 0x180f],
  [0x200b, 0x200f],
  [0x202a, 0x202e],
  [0x2060, 0x206f],
  [0x3164, 0x3164],
  [0xfe00, 0xfe0f],
  [0xfeff, 0xfeff],
  [0xffa0, 0xffa0],
  [0xfff0, 0xffff],
];

const isControl = (cp: number) => cp < 0x20 || (cp >= 0x7f && cp <= 0x9f);
const isInvisible = (cp: number) => INVISIBLE.some(([a, b]) => cp >= a && cp <= b);

/**
 * Control and invisible characters, and `$`, `{`, `}` (the app reads `${NAME}` from
 * the environment). Line feeds are allowed only where a value is made of lines.
 */
function unsafe(s: string, lines = false): boolean {
  for (const ch of s) {
    const cp = ch.codePointAt(0)!;
    if (lines && cp === 10) continue;
    if (isControl(cp) || isInvisible(cp) || ch === "$" || ch === "{" || ch === "}") return true;
  }
  return false;
}

/** One layer of percent-decoding, `+` is a space. A broken escape or invalid UTF-8 is an error. */
function decode(s: string): string | null {
  const out: number[] = [];
  const enc = new TextEncoder();
  for (let i = 0; i < s.length; ) {
    const c = s[i];
    if (c === "%") {
      const hex = s.slice(i + 1, i + 3);
      if (!/^[0-9A-Fa-f]{2}$/.test(hex)) return null;
      out.push(parseInt(hex, 16));
      i += 3;
    } else if (c === "+") {
      out.push(0x20);
      i += 1;
    } else {
      const cp = s.codePointAt(i)!;
      out.push(...enc.encode(String.fromCodePoint(cp)));
      i += cp > 0xffff ? 2 : 1;
    }
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(out));
  } catch {
    return null;
  }
}

function checkName(n: string): boolean {
  return (
    [...n].length <= MAX_NAME &&
    n.trim() === n &&
    n !== "." &&
    n !== ".." &&
    !n.startsWith("__") &&
    !/[/\\$\{\}<>"`]/.test(n)
  );
}

const isLoopback = (hostname: string) => hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";

const PRIVATE_V4: [number, number, number][] = [
  // first octet, second octet from, second octet to
  [10, 0, 255],
  [172, 16, 31],
  [192, 168, 168],
  [100, 64, 127],
  [169, 254, 254],
];
const PRIVATE_SUFFIXES = [".local", ".lan", ".internal", ".intranet", ".corp", ".home.arpa", ".localhost"];

/**
 * A host on this computer or a private network, where plain `http://` is accepted:
 * loopback, private IPv4 ranges (10/8, 172.16/12, 192.168/16, 100.64/10, 169.254/16),
 * unique-local and link-local IPv6 (fc00::/7, fe80::/10), names without a dot, and
 * names under the intranet-style suffixes. `hostname` is as `URL` gives it: lowercase,
 * IPv4 in dotted decimal, IPv6 in brackets and compressed.
 */
export function onLocalNetwork(hostname: string): boolean {
  if (isLoopback(hostname)) return true;
  const v4 = /^(\d+)\.(\d+)\.\d+\.\d+$/.exec(hostname);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    return PRIVATE_V4.some(([first, from, to]) => a === first && b >= from && b <= to);
  }
  if (hostname.startsWith("[")) {
    const head = hostname.slice(1).split(":")[0];
    const first = head ? parseInt(head, 16) : 0;
    return (first & 0xfe00) === 0xfc00 || (first & 0xffc0) === 0xfe80;
  }
  return !hostname.includes(".") || PRIVATE_SUFFIXES.some((x) => hostname.endsWith(x));
}

/** A plain `http://` address that is not on this computer: the key and requests travel unencrypted. */
export function plainHttp(url: string): boolean {
  const u = new URL(url);
  return u.protocol === "http:" && !isLoopback(u.hostname);
}

/**
 * An https address without credentials, query or fragment; plain http only for this
 * computer and private networks (`onLocalNetwork`).
 */
function checkUrl(raw: string, keepPath = false): { url: string; host: string } | null {
  if (raw.length > MAX_URL || /[\s\\$\{\}%"<>`^|@#?]/.test(raw)) return null;
  const lower = raw.slice(0, 8).toLowerCase();
  if (!lower.startsWith("https://") && !lower.startsWith("http://")) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.username || u.password || u.search || u.hash || !u.hostname) return null;
  if (u.protocol !== "https:" && !(u.protocol === "http:" && onLocalNetwork(u.hostname))) return null;
  // `URL` gives the host in ASCII: an internationalized name comes out as punycode.
  if (!/^[\x21-\x7E]+$/.test(u.host)) return null;
  const url = keepPath ? u.href : u.href.replace(/\/+$/, "");
  if (url.length > MAX_URL) return null;
  return { url, host: u.host };
}

/** Only characters that keys use. */
const keyLike = (k: string, max: number) => k.length <= max && /^[A-Za-z0-9\-_.~+/=:]+$/.test(k);

const MODEL_ID = /^[A-Za-z0-9\-_.:/@+]+$/;
const MODEL_GLOB = /^[A-Za-z0-9\-_.:/@+*?]+$/;

function checkModelList(m: string, pattern: RegExp): string[] | null {
  const out: string[] = [];
  for (const id of m.split(",")) {
    if (!id || id.length > MAX_MODEL || !pattern.test(id)) return null;
    if (!out.includes(id)) out.push(id);
  }
  return out.length > MAX_MODELS ? null : out;
}

/** RFC 7230 token characters. */
const TOKEN = /^[!#%&'*+\-.^_`|~0-9A-Za-z]+$/;
const DENIED_HEADERS = new Set([
  "authorization",
  "proxy-authorization",
  "x-api-key",
  "x-goog-api-key",
  "api-key",
  "cookie",
  "host",
  "content-length",
  "content-type",
  "content-encoding",
  "transfer-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "te",
  "trailer",
  "user-agent",
]);

export const deniedHeader = (name: string) => {
  const n = name.toLowerCase();
  return DENIED_HEADERS.has(n) || n.startsWith("proxy-") || n.startsWith("sec-");
};

function checkHeaders(v: string): Header[] | null {
  const out: Header[] = [];
  const lines = v.split(LF);
  if (lines.length > MAX_HEADERS) return null;
  for (const line of lines) {
    const i = line.indexOf(":");
    if (i <= 0) return null;
    const name = line.slice(0, i);
    const value = line.slice(i + 1).trim();
    if (name.length > MAX_HEADER_NAME || !TOKEN.test(name) || deniedHeader(name)) return null;
    if (!value || value.length > MAX_HEADER_VALUE || !/^[\x20-\x7E]+$/.test(value)) return null;
    if (out.some((h) => h.name.toLowerCase() === name.toLowerCase())) return null;
    out.push({ name, value });
  }
  return out;
}

const tokens = (s: string) => /^[1-9][0-9]*$/.test(s) && Number(s) <= MAX_SPEC_TOKENS;
const yesNo = (s: string) => s === "y" || s === "n";

function checkSpecs(v: string): Spec[] | null {
  const out: Spec[] = [];
  const entries = v.split(";");
  if (entries.length > MAX_MODELS) return null;
  for (const e of entries) {
    const f = e.split("|");
    if (f.length !== 5) return null;
    const [model, context, maxOutput, reasoning, image] = f as [string, string, string, string, string];
    if (!model || model.length > MAX_MODEL || !MODEL_ID.test(model)) return null;
    if (out.some((s) => s.model === model)) return null;
    if (context && !tokens(context)) return null;
    if (maxOutput && !tokens(maxOutput)) return null;
    if (reasoning && !yesNo(reasoning)) return null;
    if (image && !yesNo(image)) return null;
    if (!context && !maxOutput && !reasoning && !image) return null;
    out.push({
      model,
      context: context ? Number(context) : undefined,
      maxOutput: maxOutput ? Number(maxOutput) : undefined,
      reasoning: reasoning ? reasoning === "y" : undefined,
      image: image ? image === "y" : undefined,
    });
  }
  return out;
}

const PRICE = /^\d{1,6}(\.\d{1,6})?$/;

/** `model|input|output|cache_read|cache_write_5m|cache_write_1h`; the cache prices may be empty or left out. */
function checkPrices(v: string): Price[] | null {
  const out: Price[] = [];
  const entries = v.split(";");
  if (entries.length > MAX_MODELS) return null;
  for (const e of entries) {
    const f = e.split("|");
    if (f.length < 3 || f.length > 6) return null;
    const [model, input, output, cacheRead = "", w5 = "", w1 = ""] = f as string[];
    if (!model || model.length > MAX_MODEL || !MODEL_ID.test(model)) return null;
    if (out.some((p) => p.model === model)) return null;
    if (!PRICE.test(input!) || !PRICE.test(output!)) return null;
    for (const c of [cacheRead, w5, w1]) if (c && !PRICE.test(c)) return null;
    out.push({
      model,
      input: input!,
      output: output!,
      cacheRead: cacheRead || input!,
      cacheWrite5m: w5 || input!,
      cacheWrite1h: w1 || input!,
    });
  }
  return out;
}

/** A decimal whole number from 1 to `max`, without a sign or leading zeros (the app's `whole`). */
function whole(s: string, max: number): number | null {
  if (!/^[1-9][0-9]*$/.test(s) || s.length > 15) return null;
  const n = Number(s);
  return n <= max ? n : null;
}

/** Dollars as written in a cost limit (`5`, `0.5`, up to six decimals) to millionths of a dollar. */
function dollarsToMicros(s: string): number | null {
  const m = /^(0|[1-9][0-9]{0,8})(?:\.([0-9]{1,6}))?$/.exec(s);
  if (!m) return null;
  return Number(m[1]) * 1_000_000 + Number((m[2] ?? "").padEnd(6, "0"));
}

/** Millionths of a dollar written as dollars: up to six decimals, without trailing zeros (`5`, `0.125`). */
export function microsText(m: number): string {
  const frac = String(m % 1_000_000)
    .padStart(6, "0")
    .replace(/0+$/, "");
  const dollars = String(Math.floor(m / 1_000_000));
  return frac ? `${dollars}.${frac}` : dollars;
}

/**
 * Usage limits: entries separated by `;`, each `per|measure|max|every|cache_reads`.
 * `every` (1 to 60 minutes, 1 to 24 hours) is for `minute` and `hour` only and is 1
 * when empty; `cache_reads` is `y`, for `tokens` only. Empty fields at the end may be
 * left out. No two entries with the same period, `every`, measure and `cache_reads`.
 * Mirrors the app's `check_limits`.
 */
function checkLimits(v: string): Limit[] | null {
  const entries = v.split(";");
  if (entries.length > MAX_LIMITS) return null;
  const out: Limit[] = [];
  for (const e of entries) {
    const f = e.split("|");
    if (f.length < 3 || f.length > 5) return null;
    const [per, measure, rawMax, rawEvery = "", rawCache = ""] = f as string[];
    if (!includes(LIMIT_PERS, per!) || !includes(LIMIT_MEASURES, measure!)) return null;
    const max =
      measure === "cost"
        ? (() => {
            const m = dollarsToMicros(rawMax!);
            return m !== null && m >= LIMIT_COST_MIN ? m : null;
          })()
        : whole(rawMax!, MAX_LIMIT_COUNT);
    if (max === null) return null;
    let every = 1;
    if (rawEvery) {
      const most = per === "minute" ? 60 : per === "hour" ? 24 : 0;
      const n = most ? whole(rawEvery, most) : null;
      if (n === null) return null;
      every = n;
    }
    if (rawCache && !(rawCache === "y" && measure === "tokens")) return null;
    const limit: Limit = { per, every, measure, max, cacheReads: rawCache === "y" };
    if (
      out.some(
        (x) => x.per === limit.per && x.every === limit.every && x.measure === limit.measure && x.cacheReads === limit.cacheReads,
      )
    )
      return null;
    out.push(limit);
  }
  return out;
}

/** One usage limit as the app writes it: `every` 1 and cache reads off left empty, empty fields at the end dropped. */
function limitText(l: Limit): string {
  const f = [
    l.per,
    l.measure,
    l.measure === "cost" ? microsText(l.max) : String(l.max),
    l.every > 1 ? String(l.every) : "",
    l.cacheReads ? "y" : "",
  ];
  while (f.length > 3 && f[f.length - 1] === "") f.pop();
  return f.join("|");
}

function checkMultiplier(v: string): boolean {
  if (!/^\d{1,3}(\.\d{1,6})?$/.test(v)) return false;
  const n = Number(v);
  return n > 0 && n <= 100;
}

type Fail = { ok: false; problem: Problem; param?: string };
const fail = (problem: Problem, param?: string): Fail => ({ ok: false, problem, param });
const includes = <T extends string>(list: readonly T[], v: string): v is T => (list as readonly string[]).includes(v);

/**
 * Splits and decodes the parameters of a link: the fragment of the web form, or
 * the query of the app link. Each parameter at most once, no empty values.
 */
export function splitParams(query: string): { ok: true; params: Map<string, string> } | Fail {
  if (APP_PREFIX.length + query.length > MAX_LINK) return fail("tooLong");
  if (!query) return fail("empty");
  if (query.includes("#")) return fail("malformed");
  const params = new Map<string, string>();
  for (const pair of query.split("&")) {
    const i = pair.indexOf("=");
    if (i < 0) return fail("malformed");
    const k = decode(pair.slice(0, i));
    const v = decode(pair.slice(i + 1));
    if (k === null || v === null) return fail("malformed");
    if (params.has(k)) return fail("duplicateParam", k);
    if (v === "") return fail("emptyValue", k);
    params.set(k, v);
  }
  return { ok: true, params };
}

/** Validates the parameters of a link. */
export function parseParams(query: string): Result {
  const split = splitParams(query);
  return split.ok ? validateParams(split.params) : split;
}

/**
 * Validates decoded parameters: the parsed link, or the values entered in the link
 * builder. The first problem found is returned, in parameter order.
 *
 * Without `service`, the service is the one the address is recognized as, as long
 * as every parameter fits it; otherwise the link is a custom upstream, which takes
 * every parameter. So a link written for the first version, such as an official
 * address with another path, stays valid as it was. An explicit `service` is strict.
 */
export function validateParams(input: Map<string, string>): Result {
  const unknown: [string, string][] = [];
  for (const [k, v] of input) {
    if (includes(NEVER, k)) return fail("neverAccepted", k);
    if (v === "") return fail("emptyValue", k);
    if (unsafe(v, k === "headers")) return fail("invalid", k);
    if (!includes(PARAMS, k)) unknown.push([k, v]);
  }

  const rawService = input.get("service");
  const rawUrl = input.get("url");
  let url: { url: string; host: string } | null = null;
  if (rawUrl !== undefined) {
    url = checkUrl(rawUrl);
    if (!url) return fail("invalid", "url");
  }
  if (rawService !== undefined) {
    if (!includes(SERVICES, rawService)) return fail("invalid", "service");
    return validateFor(input, rawService, false, url, unknown);
  }
  if (!url) return fail("missing", "url");
  const recognized = serviceOfUrl(url.url);
  const r = validateFor(input, recognized, true, url, unknown);
  return r.ok || recognized === "custom" ? r : validateFor(input, "custom", true, url, unknown);
}

/** Validates the parameters for one service. `recognized`: the link has no `service`. */
function validateFor(
  input: Map<string, string>,
  service: Service,
  recognized: boolean,
  url: { url: string; host: string } | null,
  unknown: [string, string][],
): Result {
  const get = (p: Param) => input.get(p);
  const out: [Param, string][] = [];
  const put = (p: Param, v: string | undefined) => {
    if (v !== undefined) out.push([p, v]);
  };
  const rules = SERVICE_RULES[service];

  // Authentication method
  const rawAuth = get("auth");
  if (rawAuth !== undefined && !includes(AUTHS, rawAuth)) return fail("invalid", "auth");
  const auth: Auth = (rawAuth as Auth | undefined) ?? "key";
  if (!rules.auth.includes(auth)) return fail("notApplicable", "auth");
  const fields = fieldsFor(service, auth);
  for (const p of PARAMS) if (input.has(p) && !fields.has(p)) return fail("notApplicable", p);

  // Site (Z.ai / BigModel): from the link, else from the address, else BigModel
  let site: Site | undefined;
  if (service === "zai") {
    const rawSite = get("site");
    if (rawSite !== undefined && !includes(SITES, rawSite)) return fail("invalid", "site");
    const fromUrl = url ? (Object.keys(ZAI_ADDRESS) as Site[]).find((s) => ZAI_ADDRESS[s] === url!.url) : undefined;
    if (url && !fromUrl) return fail("mismatch", "url");
    if (rawSite !== undefined && fromUrl && rawSite !== fromUrl) return fail("mismatch", "site");
    site = (rawSite as Site | undefined) ?? fromUrl ?? "bigmodel";
  }

  // Address
  let address: string | undefined;
  let region: string | undefined;
  const rawRegion = get("region");
  if (rawRegion !== undefined && !/^[a-z0-9-]{1,32}$/.test(rawRegion)) return fail("invalid", "region");
  if (auth !== "account") {
    if (service === "zai") address = ZAI_ADDRESS[site!];
    else if (rules.url === "own") {
      if (url && url.url !== rules.address) return fail("mismatch", "url");
      address = rules.address;
    } else if (rules.url === "required") {
      if (!url) return fail("missing", "url");
      address = url.url;
    } else if (service === "bedrock") {
      // A standard Bedrock address carries its region; the dialog asks for a signing
      // region only for another address when it signs requests (access keys).
      const inUrl = url ? BEDROCK_HOST.exec(new URL(url.url).hostname)?.[1] : undefined;
      if (url && !inUrl) {
        if (rawRegion !== undefined && auth === "key") return fail("notApplicable", "region");
        region = rawRegion;
        address = url.url;
      } else {
        if (inUrl && rawRegion !== undefined && rawRegion !== inUrl) return fail("mismatch", "region");
        region = inUrl ?? rawRegion ?? DEFAULT_BEDROCK_REGION;
        address = url ? url.url : bedrockAddress(region);
      }
    } else address = url?.url ?? rules.address;
  }

  // Protocol: only where the dialog offers a choice; a value it fills in by itself may only be repeated
  const rawProtocol = get("protocol");
  let protocol: Protocol | undefined;
  if (rawProtocol !== undefined) {
    if (!includes(PROTOCOLS, rawProtocol)) return fail("invalid", "protocol");
    const allowed = rules.protocol;
    const ok = typeof allowed === "string" ? rawProtocol === allowed : allowed !== null && allowed.includes(rawProtocol);
    if (!ok) return fail("mismatch", "protocol");
    protocol = rawProtocol;
  }

  const name = get("name");
  if (name !== undefined && !checkName(name)) return fail("invalid", "name");

  const key = get("key");
  if (key !== undefined && !keyLike(key, MAX_KEY)) return fail("invalid", "key");

  let oauth: ImportLink["oauth"];
  if (auth === "oauth") {
    const e = get("oauth_endpoint");
    if (e === undefined) return fail("missing", "oauth_endpoint");
    const endpoint = checkUrl(e, true);
    if (!endpoint) return fail("invalid", "oauth_endpoint");
    const refresh = get("oauth_refresh");
    if (refresh === undefined) return fail("missing", "oauth_refresh");
    if (!keyLike(refresh, MAX_LONG_SECRET)) return fail("invalid", "oauth_refresh");
    const clientId = get("oauth_client_id");
    if (clientId !== undefined && !keyLike(clientId, MAX_KEY)) return fail("invalid", "oauth_client_id");
    const clientSecret = get("oauth_client_secret");
    if (clientSecret !== undefined && !keyLike(clientSecret, MAX_KEY)) return fail("invalid", "oauth_client_secret");
    oauth = { endpoint: endpoint.url, refresh, clientId, clientSecret };
  }

  let aws: ImportLink["aws"];
  if (auth === "aws-keys") {
    const id = get("aws_access_key_id");
    if (id === undefined) return fail("missing", "aws_access_key_id");
    if (!/^[A-Z0-9]{16,128}$/.test(id)) return fail("invalid", "aws_access_key_id");
    const secret = get("aws_secret_access_key");
    if (secret === undefined) return fail("missing", "aws_secret_access_key");
    if (!keyLike(secret, MAX_KEY)) return fail("invalid", "aws_secret_access_key");
    const token = get("aws_session_token");
    if (token !== undefined && !keyLike(token, MAX_LONG_SECRET)) return fail("invalid", "aws_session_token");
    aws = { accessKeyId: id, secretAccessKey: secret, sessionToken: token };
  }

  let headers: Header[] = [];
  const rawHeaders = get("headers");
  if (rawHeaders !== undefined) {
    const h = checkHeaders(rawHeaders);
    if (!h) return fail("invalid", "headers");
    headers = h;
  }

  const clientIdentity = get("client_identity");
  if (clientIdentity !== undefined && clientIdentity !== "on") return fail("invalid", "client_identity");

  const rawConcurrency = get("concurrency");
  let concurrency: number | undefined;
  if (rawConcurrency !== undefined) {
    if (!/^[1-9][0-9]{0,3}$/.test(rawConcurrency) || Number(rawConcurrency) > MAX_CONCURRENCY)
      return fail("invalid", "concurrency");
    concurrency = Number(rawConcurrency);
  }

  let limits: Limit[] = [];
  const rawLimits = get("limits");
  if (rawLimits !== undefined) {
    const l = checkLimits(rawLimits);
    if (!l) return fail("invalid", "limits");
    limits = l;
  }

  const balance = get("balance");
  if (balance !== undefined && !includes(BALANCES, balance)) return fail("invalid", "balance");

  let models: string[] = [];
  const rawModels = get("models");
  if (rawModels !== undefined) {
    const m = checkModelList(rawModels, MODEL_ID);
    if (!m) return fail("invalid", "models");
    models = m;
  }
  let modelsOnly: string[] | undefined;
  const rawOnly = get("models_only");
  if (rawOnly !== undefined) {
    const m = checkModelList(rawOnly, MODEL_GLOB);
    if (!m) return fail("invalid", "models_only");
    modelsOnly = m;
  }
  let specs: Spec[] = [];
  const rawSpecs = get("specs");
  if (rawSpecs !== undefined) {
    const s = checkSpecs(rawSpecs);
    if (!s) return fail("invalid", "specs");
    specs = s;
  }

  const billing = get("billing");
  if (billing !== undefined && !includes(BILLINGS, billing)) return fail("invalid", "billing");
  const multiplier = get("price_multiplier");
  const rawPrices = get("prices");
  let priceSheet: ImportLink["priceSheet"];
  if (multiplier !== undefined || rawPrices !== undefined) {
    // A price sheet is chosen only for per-token billing
    if ((billing ?? rules.billing) === "free") return fail("notApplicable", multiplier !== undefined ? "price_multiplier" : "prices");
    if (multiplier !== undefined && !checkMultiplier(multiplier)) return fail("invalid", "price_multiplier");
    let prices: Price[] = [];
    if (rawPrices !== undefined) {
      const p = checkPrices(rawPrices);
      if (!p) return fail("invalid", "prices");
      prices = p;
    }
    priceSheet = { multiplier: multiplier ?? "1", prices };
  }

  // The parameters handed to the app, normalized, in link order
  for (const p of PARAMS) {
    const v = get(p);
    if (v === undefined) continue;
    if (p === "url") put(p, url!.url);
    else if (p === "oauth_endpoint") put(p, oauth!.endpoint);
    else if (p === "headers") put(p, headers.map((h) => `${h.name}: ${h.value}`).join(LF));
    else if (p === "models") put(p, models.join(","));
    else if (p === "models_only") put(p, modelsOnly!.join(","));
    else if (p === "limits") put(p, limits.map(limitText).join(";"));
    else put(p, v);
  }

  const hosts: string[] = [];
  const plainHosts: string[] = [];
  for (const u of [address, oauth?.endpoint]) {
    if (!u) continue;
    const host = new URL(u).host;
    if (!hosts.includes(host)) hosts.push(host);
    if (plainHttp(u) && !plainHosts.includes(host)) plainHosts.push(host);
  }

  const link: ImportLink = {
    service,
    recognized,
    auth,
    site,
    name,
    address,
    hosts,
    plainHosts,
    protocol,
    region,
    key,
    oauth,
    aws,
    headers,
    clientIdentity: clientIdentity === "on",
    concurrency,
    limits,
    balance: balance as Balance | undefined,
    models,
    modelsOnly,
    specs,
    billing: billing as Billing | undefined,
    priceSheet,
    since: sinceOf(out.map(([p]) => p)),
    params: out,
  };
  if (APP_PREFIX.length + encode(link, unknown).length > MAX_LINK) return fail("tooLong");
  return { ok: true, link, unknown };
}

/**
 * The parameters of a validated import, encoded, in a fixed order. Parameters this
 * copy does not know are passed on after them, re-encoded, for a newer app to read.
 */
export function encode(l: ImportLink, unknown: [string, string][] = []): string {
  return [...l.params, ...unknown].map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}

/** The link that opens the app. Built only from checked values. */
export function appLink(l: ImportLink, unknown: [string, string][] = []): string {
  return `${APP_PREFIX}${encode(l, unknown)}`;
}

/** The web form: the parameters stay in the fragment, which browsers do not send to the server. */
export function webLink(l: ImportLink, origin = "https://thinkwat.ch"): string {
  return `${origin}/import#${encode(l)}`;
}

/** A parameter name is shown to people only when it is short and plain. */
export const showableParam = (name: string | undefined): name is string => !!name && /^[a-z0-9_]{1,32}$/.test(name);
