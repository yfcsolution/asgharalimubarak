import { InlineAd } from "@/components/ads/InlineAd";
import { WordPressContent } from "@/components/WordPressContent";

type ArticleBodyProps = {
  html: string;
};

function splitContentForInlineAd(html: string): {
  before: string;
  after: string;
} {
  const parts = html.split(/(<\/p>)/i);
  let paragraphCount = 0;
  let splitIndex = -1;

  for (let i = 0; i < parts.length; i += 1) {
    if (/^<\/p>$/i.test(parts[i])) {
      paragraphCount += 1;
      if (paragraphCount >= 5) {
        splitIndex = i + 1;
        break;
      }
    }
  }

  if (splitIndex <= 0 || paragraphCount < 4) {
    return { before: html, after: "" };
  }

  return {
    before: parts.slice(0, splitIndex).join(""),
    after: parts.slice(splitIndex).join(""),
  };
}

export async function ArticleBody({ html }: ArticleBodyProps) {
  const { before, after } = splitContentForInlineAd(html);

  return (
    <div className="article-body">
      <WordPressContent html={before} />
      {after ? (
        <>
          <InlineAd />
          <WordPressContent html={after} />
        </>
      ) : null}
    </div>
  );
}
