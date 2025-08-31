interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className="prose max-w-none prose-p:leading-relaxed prose-headings:scroll-mt-24 prose-img:rounded-xl ql-view">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
