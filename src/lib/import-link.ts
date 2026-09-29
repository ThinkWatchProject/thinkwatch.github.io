// Import links for ThinkWatch Lite: `thinkwatch://import?…` and its web form
// `https://thinkwat.ch/import#…`. A relay hands one to its users to pre-fill a
// new upstream in the app.
//
// The rules mirror the app's parser (src-tauri/src/import_link.rs in the Lite
// repository). The app validates every link again and is the authority; this
// copy lets the web page and the link builder reject a bad link before handing
// it on, instead of passing along something the app would drop.
//
// Every value is treated as hostile: any web page can produce a link.

export const PARAMS = ["name", "url", "protocol", "key", "models"] as const;
export type Param = (typeof PARAMS)[number];

export const PROTOCOLS = ["anthropic", "openai-chat", "openai-responses", "gemini"] as const;
export type Protocol = (typeof PROTOCOLS)[number];

export const MAX_LINK = 8192;
export const MAX_NAME = 64;
export const MAX_URL = 2048;
export const MAX_KEY = 512;
export const MAX_MODEL = 128;
export const MAX_MODELS = 64;

/** A validated import: what the app is asked to create. */
export type ImportLink = {
  name?: string;
  /** Normalized: the host in ASCII (IDN as punycode), no trailing slash */
  baseUrl: string;
  /** Where requests and the key are sent, in ASCII, with the port when there is one */
  host: string;
  protocol?: Protocol;
  key?: string;
  models: string[];
};

export type Problem =
  | "empty"
  | "tooLong"
  | "unknownParam"
  | "duplicateParam"
  | "emptyValue"
  | "missingUrl"
  | "name"
  | "url"
  | "protocol"
  | "key"
  | "models";

export type Result = { ok: true; link: ImportLink } | { ok: false; problem: Problem; param?: string };

/** Zero-width and direction-changing characters, and the replacement character. */
const INVISIBLE =
  /[­͏؜ᅟᅠ឴឵᠋-᠏​-‏‪-‮⁠-⁯ㅤ︀-️﻿ﾠ￰-￿]/;
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001F\u007F-\u009F]/;

const unsafe = (s: string) => CONTROL.test(s) || INVISIBLE.test(s);

function checkName(n: string): boolean {
  return (
    [...n].length <= MAX_NAME &&
    n.trim() === n &&
    n !== "." &&
    n !== ".." &&
    !n.startsWith("__") &&
    !unsafe(n) &&
    !/[/\\${}<>"`]/.test(n)
  );
}

function checkUrl(raw: string): { baseUrl: string; host: string } | null {
  if (raw.length > MAX_URL || unsafe(raw) || /[\s\\${}%"<>`^|@#?]/.test(raw)) return null;
  const lower = raw.slice(0, 8).toLowerCase();
  if (!lower.startsWith("https://") && !lower.startsWith("http://")) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.username || u.password || u.search || u.hash || !u.hostname) return null;
  const loopback = u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "[::1]";
  if (u.protocol !== "https:" && !(u.protocol === "http:" && loopback)) return null;
  // `URL` gives the host in ASCII: an internationalized name comes out as punycode.
  if (!/^[\x21-\x7E]+$/.test(u.host)) return null;
  const baseUrl = u.href.replace(/\/+$/, "");
  if (baseUrl.length > MAX_URL) return null;
  return { baseUrl, host: u.host };
}

/** Only characters that keys use. No `$`, `{` or `}`: the app would read `${NAME}` from the environment. */
function checkKey(k: string): boolean {
  return k.length <= MAX_KEY && /^[A-Za-z0-9\-_.~+/=:]+$/.test(k);
}

function checkModels(m: string): string[] | null {
  const out: string[] = [];
  for (const id of m.split(",")) {
    if (!id || id.length > MAX_MODEL || !/^[A-Za-z0-9\-_.:/@+]+$/.test(id)) return null;
    if (!out.includes(id)) out.push(id);
  }
  return out.length > MAX_MODELS ? null : out;
}

/** Validates the parameters of a link: the fragment of the web form, or the query of the app link. */
export function parseParams(query: string): Result {
  if (query.length > MAX_LINK) return { ok: false, problem: "tooLong" };
  if (!query) return { ok: false, problem: "empty" };
  const params = new URLSearchParams(query);
  const seen = new Set<string>();
  for (const [k, v] of params) {
    if (!(PARAMS as readonly string[]).includes(k)) return { ok: false, problem: "unknownParam", param: k };
    if (seen.has(k)) return { ok: false, problem: "duplicateParam", param: k };
    seen.add(k);
    if (v === "") return { ok: false, problem: "emptyValue", param: k };
  }
  return validate({
    name: params.get("name") ?? undefined,
    url: params.get("url") ?? "",
    protocol: params.get("protocol") ?? undefined,
    key: params.get("key") ?? undefined,
    models: params.get("models") ?? undefined,
  });
}

/** Validates values as they are entered in the link builder. Empty optional values are left out. */
export function validate(v: { name?: string; url: string; protocol?: string; key?: string; models?: string }): Result {
  if (!v.url) return { ok: false, problem: "missingUrl" };
  const url = checkUrl(v.url);
  if (!url) return { ok: false, problem: "url" };
  if (v.name !== undefined && !checkName(v.name)) return { ok: false, problem: "name" };
  if (v.protocol !== undefined && !(PROTOCOLS as readonly string[]).includes(v.protocol))
    return { ok: false, problem: "protocol" };
  if (v.key !== undefined && !checkKey(v.key)) return { ok: false, problem: "key" };
  let models: string[] = [];
  if (v.models !== undefined) {
    const m = checkModels(v.models);
    if (!m) return { ok: false, problem: "models" };
    models = m;
  }
  return {
    ok: true,
    link: {
      name: v.name,
      baseUrl: url.baseUrl,
      host: url.host,
      protocol: v.protocol as Protocol | undefined,
      key: v.key,
      models,
    },
  };
}

/** The parameters of a validated import, encoded, in a fixed order. */
export function encode(l: ImportLink): string {
  const parts: string[] = [];
  const add = (k: Param, v: string | undefined) => {
    if (v) parts.push(`${k}=${encodeURIComponent(v)}`);
  };
  add("name", l.name);
  add("url", l.baseUrl);
  add("protocol", l.protocol);
  add("key", l.key);
  add("models", l.models.join(","));
  return parts.join("&");
}

/** The link that opens the app. Built only from validated values. */
export function appLink(l: ImportLink): string {
  return `thinkwatch://import?${encode(l)}`;
}

/** The web form: the parameters stay in the fragment, which browsers do not send to the server. */
export function webLink(l: ImportLink, origin = "https://thinkwat.ch"): string {
  return `${origin}/import#${encode(l)}`;
}
