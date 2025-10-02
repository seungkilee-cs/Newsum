export const normalizeArticlePayload = (article) => {
  if (!article || typeof article !== "object") {
    throw new Error("Invalid article payload");
  }

  const publishDateInput = article.publishDate || article.date || null;
  const publishDate = publishDateInput ? new Date(publishDateInput) : undefined;
  const isPublishDateValid = publishDate instanceof Date && !Number.isNaN(publishDate.valueOf());

  const content = Array.isArray(article.content)
    ? article.content
    : typeof article.content === "string" && article.content.length > 0
      ? [article.content]
      : [];

  const summary = Array.isArray(article.summary)
    ? article.summary
    : typeof article.summary === "string" && article.summary.length > 0
      ? [article.summary]
      : [];

  return {
    title: article.title,
    author: article.author ?? "",
    publishDate: isPublishDateValid ? publishDate : undefined,
    content,
    summary,
    imageUrl: article.imageUrl ?? "",
    url: article.url,
    site: article.site,
  };
};
