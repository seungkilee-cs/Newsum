import axios from "axios";
import { isStaging, articleEndpoint } from "../constants/config";
import mockArticles from "../data/mockData";
import { normalizeUrlCustom } from "../utils/urlUtils";
import { debugLog, debugError } from "../utils/debugUtils";

export const fetchArticles = async (site) => {
  try {
    let fetchedArticles = [];

    debugLog("fetchArticles called with site:", site);
    debugLog("isStaging:", isStaging);

    if (isStaging) {
      debugLog("Using mock articles in staging environment");
      fetchedArticles = mockArticles;
      debugLog("Mock articles:", fetchedArticles);
    } else {
      debugLog("Fetching data from backend");
      debugLog(`Sending request to: ${articleEndpoint}`);
      const response = await axios.get(articleEndpoint);
      debugLog("Response received:", response);

      if (response.data && Array.isArray(response.data)) {
        fetchedArticles = response.data;
      } else {
        debugError("Unexpected data format received:", response.data);
        throw new Error("Unexpected data format");
      }
    }

    debugLog("Fetched articles before filtering:", fetchedArticles);
    debugLog("site: ", site);
    const normalizedSelectedSiteUrl = normalizeUrlCustom(site?.url);
    debugLog("Normalized selected site URL:", normalizedSelectedSiteUrl);

    const filteredArticles = fetchedArticles.filter((article) => {
      const normalizedArticleSite = normalizeUrlCustom(article.site);
      debugLog("Normalized article site:", normalizedArticleSite);
      const isMatch = normalizedArticleSite === normalizedSelectedSiteUrl;
      debugLog("Is match:", isMatch);
      return isMatch;
    });

    debugLog("Filtered articles:", filteredArticles);
    return filteredArticles;
  } catch (error) {
    debugError("Error fetching articles:", error);
    if (error.response) {
      debugError("Response data:", error.response.data);
      debugError("Response status:", error.response.status);
    }
    return [];
  }
};
