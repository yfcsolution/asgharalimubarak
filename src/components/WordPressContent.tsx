type WordPressContentProps = {
  html: string;
};

export function WordPressContent({ html }: WordPressContentProps) {
  return (
    <div
      className="wp-content prose prose-neutral max-w-none"
      dir="auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
