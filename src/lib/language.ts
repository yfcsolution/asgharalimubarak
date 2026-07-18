export type ScriptKind = "latin" | "arabic" | "cyrillic" | "other" | "mixed";
export type PreferredLanguage = "auto" | "en" | "ur";

const ARABIC =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const CYRILLIC = /[\u0400-\u04FF\u0500-\u052F]/;
const LATIN = /[A-Za-z\u00C0-\u024F]/;

function charScript(char: string): ScriptKind {
  if (ARABIC.test(char)) return "arabic";
  if (CYRILLIC.test(char)) return "cyrillic";
  if (LATIN.test(char)) return "latin";
  return "other";
}

export function detectPrimaryScript(text: string): ScriptKind {
  let latin = 0;
  let arabic = 0;
  let cyrillic = 0;

  for (const char of text) {
    const kind = charScript(char);
    if (kind === "latin") latin += 1;
    if (kind === "arabic") arabic += 1;
    if (kind === "cyrillic") cyrillic += 1;
  }

  const total = latin + arabic + cyrillic;
  if (total === 0) return "other";

  const ranked = [
    { kind: "arabic" as const, count: arabic },
    { kind: "latin" as const, count: latin },
    { kind: "cyrillic" as const, count: cyrillic },
  ].sort((a, b) => b.count - a.count);

  if (ranked[0].count / total < 0.55 && ranked[1].count > 0) {
    return "mixed";
  }

  return ranked[0].kind;
}

type Segment = {
  text: string;
  script: ScriptKind;
};

function pushSegment(segments: Segment[], text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return;
  const script = detectPrimaryScript(cleaned);
  if (script === "cyrillic") return;
  segments.push({ text: cleaned, script });
}

function splitBySeparators(title: string): string[] {
  return title
    .split(/\n+|\||•|·|{|}|\u2014|\u2013|\s{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitByScriptRuns(text: string): Segment[] {
  const segments: Segment[] = [];
  let buffer = "";
  let current: ScriptKind | null = null;

  for (const char of text) {
    const kind = charScript(char);
    if (kind === "other") {
      buffer += char;
      continue;
    }

    if (current === null) {
      current = kind;
      buffer += char;
      continue;
    }

    if (kind === current) {
      buffer += char;
      continue;
    }

    // Keep short Latin tokens inside Arabic (or vice versa) when they look like
    // names/punctuation within one phrase, unless the buffer is already a long title.
    const bufferLetters = buffer.replace(/[^\p{L}\p{N}]+/gu, "");
    if (
      bufferLetters.length < 24 &&
      ((current === "arabic" && kind === "latin") ||
        (current === "latin" && kind === "arabic"))
    ) {
      buffer += char;
      current = "mixed";
      continue;
    }

    pushSegment(segments, buffer);
    buffer = char;
    current = kind;
  }

  pushSegment(segments, buffer);
  return segments;
}

function segmentTitle(title: string): Segment[] {
  const parts = splitBySeparators(title);
  const segments: Segment[] = [];

  for (const part of parts) {
    const runs = splitByScriptRuns(part);
    if (runs.length === 0) continue;
    segments.push(...runs);
  }

  // Merge adjacent same-script pieces
  const merged: Segment[] = [];
  for (const segment of segments) {
    const last = merged[merged.length - 1];
    if (last && last.script === segment.script) {
      last.text = `${last.text} ${segment.text}`.replace(/\s+/g, " ").trim();
    } else {
      merged.push({ ...segment });
    }
  }

  return merged.filter((segment) => segment.script !== "cyrillic");
}

function choosePreferred(
  segments: Segment[],
  preferredLanguage: PreferredLanguage,
): Segment | null {
  if (segments.length === 0) return null;

  const urdu = segments.find((s) => s.script === "arabic" || s.script === "mixed");
  const english = segments.find((s) => s.script === "latin" || s.script === "mixed");

  if (preferredLanguage === "ur" && urdu) return urdu;
  if (preferredLanguage === "en" && english) return english;

  // Prefer the first meaningful non-Cyrillic segment's language family.
  const first = segments[0];
  if (first.script === "arabic") return urdu ?? first;
  if (first.script === "latin") return english ?? first;
  return first;
}

export function getDisplayTitle(
  title: string,
  preferredLanguage: PreferredLanguage = "auto",
): {
  text: string;
  fullText: string;
  lang: "en" | "ur";
  dir: "ltr" | "rtl" | "auto";
} {
  const fullText = title.replace(/\s+/g, " ").trim();
  const segments = segmentTitle(fullText);

  if (segments.length <= 1) {
    const script = detectPrimaryScript(fullText);
    const lang = script === "arabic" ? "ur" : "en";
    return {
      text: fullText,
      fullText,
      lang,
      dir: lang === "ur" ? "rtl" : "auto",
    };
  }

  // Drop obvious duplicate translations: keep one primary language block.
  const chosen = choosePreferred(segments, preferredLanguage) ?? segments[0];
  const lang = chosen.script === "arabic" ? "ur" : "en";

  return {
    text: chosen.text,
    fullText,
    lang,
    dir: lang === "ur" ? "rtl" : "auto",
  };
}

export function getDisplayExcerpt(
  excerpt: string,
  preferredLanguage: PreferredLanguage = "auto",
  maxLength = 180,
): {
  text: string;
  lang: "en" | "ur";
  dir: "ltr" | "rtl" | "auto";
} {
  const cleaned = excerpt.replace(/\s+/g, " ").trim();
  const display = getDisplayTitle(cleaned, preferredLanguage);
  const chars = Array.from(display.text);
  const text =
    chars.length > maxLength
      ? `${chars.slice(0, maxLength).join("").trimEnd()}…`
      : display.text;

  return {
    text,
    lang: display.lang,
    dir: display.dir,
  };
}

export function readingTimeMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}
