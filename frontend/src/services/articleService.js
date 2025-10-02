import { isStaging, articleEndpoint } from "../constants/config";
import mockArticles from "../data/mockData";
import { normalizeUrlCustom } from "../utils/urlUtils";
import { debugLog, debugError, isDebugEnabled } from "../utils/debugUtils";
import apiClient from "./apiClient";

const formatDate = (value) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) return "";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const normalizeArticle = (article) => {
  if (!article) {
    return null;
  }

  const publishDate = article.publishDate || article.date || null;

  return {
    id: article._id || article.id || article.url,
    title: article.title || "Untitled",
    author: article.author || "",
    publishDate,
    publishDateLabel: formatDate(publishDate),
    summary: Array.isArray(article.summary)
      ? article.summary
      : typeof article.summary === "string" && article.summary.length > 0
        ? [article.summary]
        : [],
    content: Array.isArray(article.content)
      ? article.content
      : typeof article.content === "string" && article.content.length > 0
        ? [article.content]
        : [],
    imageUrl: article.imageUrl || "",
    url: article.url,
    site: article.site,
  };
};

export const fetchArticles = async (site) => {
  try {
    let fetchedArticles = [];

    if (isDebugEnabled()) {
      debugLog("fetchArticles called with site:", site);
      debugLog("isStaging:", isStaging);
    }

    if (isStaging) {
      if (isDebugEnabled()) {
        debugLog("Using mock articles in staging environment");
      }
      fetchedArticles = mockArticles;
      if (isDebugEnabled()) {
        debugLog("Mock articles:", fetchedArticles);
      }
    } else {
      if (isDebugEnabled()) {
        debugLog("Fetching data from backend");
        debugLog(`Sending request to: ${articleEndpoint}`);
      }
      const params = {
        limit: 20,
      };

      if (site?.url) {
        params.site = site.url;
      }

      const response = await apiClient.get(articleEndpoint, {
        params,
      });
      if (isDebugEnabled()) {
        debugLog("Response received:", response);
      }
      const payload = response.data?.data ?? response.data;

      if (payload && Array.isArray(payload)) {
        fetchedArticles = payload;
      } else {
        debugError("Unexpected data format received:", response.data);
        throw new Error("Unexpected data format");
      }
    }

    if (isDebugEnabled()) {
      debugLog("Fetched articles before filtering:", fetchedArticles);
      debugLog("site: ", site);
    }
    const normalizedSelectedSiteUrl = normalizeUrlCustom(site?.url);
    if (isDebugEnabled()) {
      debugLog("Normalized selected site URL:", normalizedSelectedSiteUrl);
    }

    const filteredArticles = fetchedArticles.filter((article) => {
      const normalizedArticleSite = normalizeUrlCustom(article.site);
      if (isDebugEnabled()) {
        debugLog("Normalized article site:", normalizedArticleSite);
      }
      const isMatch = normalizedArticleSite === normalizedSelectedSiteUrl;
      if (isDebugEnabled()) {
        debugLog("Is match:", isMatch);
      }
      return isMatch;
    });

    if (isDebugEnabled()) {
      debugLog("Filtered articles:", filteredArticles);
    }

    return filteredArticles
      .map(normalizeArticle)
      .filter(Boolean)
      .sort((a, b) => {
        const aDate = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const bDate = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return bDate - aDate;
      });
  } catch (error) {
    debugError("Error fetching articles:", error);
    if (error.response) {
      debugError("Response data:", error.response.data);
      debugError("Response status:", error.response.status);
    }
    return [];
  }
};
