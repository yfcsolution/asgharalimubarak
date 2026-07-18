import { detectPrimaryScript } from "@/lib/language";

type WordPressContentProps = {
  html: string;
};

function enhanceContentHtml(html: string): string {
  // Soft-clean obvious bare caption URLs glued into empty paragraphs without deleting intentional links.
  let next = html.replace(
    /<p>(?:\s|&nbsp;)*(https?:\/\/asgharalimubarakblog\.wordpress\.com\/[^<]{0,180})<\/p>/gi,
    "",
  );

  next = next.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim();
    if (!text) return full;
    const script = detectPrimaryScript(text);
    if (script === "arabic") {
      return `<p${attrs} dir="rtl" lang="ur" class="wp-p-ur">${inner}</p>`;
    }
    if (script === "latin") {
      return `<p${attrs} dir="ltr" lang="en" class="wp-p-en">${inner}</p>`;
    }
    return `<p${attrs} dir="auto">${inner}</p>`;
  });

  return next;
}

export function WordPressContent({ html }: WordPressContentProps) {
  return (
    <div
      className="wp-content prose prose-neutral max-w-none"
      dir="auto"
      dangerouslySetInnerHTML={{ __html: enhanceContentHtml(html) }}
    />
  );
}
