// src/services/articleService.js
import axios from "axios";
import { isStaging, articleEndpoint } from "../constants/config";
import mockArticles from "../data/mockData";
import { normalizeUrlCustom } from "../utils/urlUtils";

export const fetchArticles = async (site) => {
  try {
    let fetchedArticles = [];

    if (isStaging) {
      console.log("Using mock data in staging environment");
      fetchedArticles = mockArticles;
    } else {
      console.log("Fetching data from backend");
      console.log(`Sending request to: ${articleEndpoint}`);
      const response = await axios.get(articleEndpoint);
      console.log("Response received:", response);

      if (response.data && Array.isArray(response.data)) {
        fetchedArticles = response.data;
      } else {
        console.error("Unexpected data format received:", response.data);
        throw new Error("Unexpected data format");
      }
    }

    const normalizedSelectedSiteUrl = normalizeUrlCustom(site?.url);

    return fetchedArticles.filter((article) => {
      const normalizedArticleSite = normalizeUrlCustom(article.site);
      return normalizedArticleSite === normalizedSelectedSiteUrl;
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return [];
  }
};
