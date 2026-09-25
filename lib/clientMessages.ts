import type { AbstractIntlMessages } from "next-intl";

import { toolCompNamespace } from "@/data/toolCompNamespaces";

type Messages = Record<string, unknown>;

const TOOL_META_CLIENT_FIELDS = ["name", "desc"] as const;

const SHARED_NAMESPACES = ["Common", "Brand", "Toast"] as const;

function pickToolMeta(meta: unknown): Messages {
  if (!meta || typeof meta !== "object") return {};
  const result: Messages = {};
  for (const [slug, value] of Object.entries(meta as Messages)) {
    if (!value || typeof value !== "object") continue;
    const entry = value as Messages;
    const trimmed: Messages = {};
    for (const field of TOOL_META_CLIENT_FIELDS) {
      if (entry[field] !== undefined) trimmed[field] = entry[field];
    }
    result[slug] = trimmed;
  }
  return result;
}

export function pickClientMessages(
  messages: AbstractIntlMessages
): AbstractIntlMessages {
  const source = messages as Messages;
  const next: Messages = {};

  for (const [namespace, value] of Object.entries(source)) {
    if (namespace === "ToolContent" || namespace === "comp") continue;
    if (namespace === "ToolMeta") {
      next[namespace] = pickToolMeta(value);
      continue;
    }
    next[namespace] = value;
  }

  return next as AbstractIntlMessages;
}

export function pickToolMessages(
  messages: AbstractIntlMessages,
  slug: string
): AbstractIntlMessages {
  const compKey = toolCompNamespace(slug);
  return pickNestedMessages(messages, compKey, [slug]);
}

export function pickCompMessages(
  messages: AbstractIntlMessages,
  compKey: string
): AbstractIntlMessages {
  return pickNestedMessages(messages, compKey, []);
}

function pickNestedMessages(
  messages: AbstractIntlMessages,
  compKey: string | undefined,
  metaSlugs: string[]
): AbstractIntlMessages {
  const source = messages as Messages;
  const result: Messages = {};

  for (const namespace of SHARED_NAMESPACES) {
    if (source[namespace] !== undefined) result[namespace] = source[namespace];
  }

  if (compKey) {
    const entry = (source.comp as Messages | undefined)?.[compKey];
    if (entry) result.comp = { [compKey]: entry };
  }

  if (metaSlugs.length > 0) {
    const meta = source.ToolMeta as Messages | undefined;
    const picked: Messages = {};
    for (const slug of metaSlugs) {
      if (meta?.[slug]) picked[slug] = meta[slug];
    }
    if (Object.keys(picked).length > 0) result.ToolMeta = picked;
  }

  return result as AbstractIntlMessages;
}
