import { isStaging, siteEndpoint } from "../constants/config";
import apiClient from "./apiClient";
// import mockSites from "../data/siteData";
import { sites } from "../data/siteData.js";
import { debugLog, debugError, isDebugEnabled } from "../utils/debugUtils";

export const fetchSites = async () => {
  try {
    let fetchedSites = [];

    if (isStaging) {
      if (isDebugEnabled()) {
        debugLog("Using mock site data in staging environment");
      }
      fetchedSites = sites;
      if (isDebugEnabled()) {
        debugLog("static sites:", fetchedSites);
      }
    } else {
      if (isDebugEnabled()) {
        debugLog("Fetching site data from backend");
        debugLog(`Sending request to: ${siteEndpoint}`);
      }
      const response = await apiClient.get(siteEndpoint);
      if (isDebugEnabled()) {
        debugLog("Response received:", response);
      }

      const payload = response.data?.data ?? response.data;

      if (payload && Array.isArray(payload)) {
        fetchedSites = payload;
      } else {
        debugError("Unexpected data format received:", response.data);
        throw new Error("Unexpected data format");
      }
    }

    return fetchedSites;
  } catch (error) {
    if (isDebugEnabled()) {
      debugError("Error fetching sites:", error);
      debugError("Error fetching sites:", error.message);
      if (error.response) {
        debugError("Response data:", error.response.data);
        debugError("Response status:", error.response.status);
        debugError("Response headers:", error.response.headers);
      } else if (error.request) {
        debugError("No response received:", error.request);
      } else {
        debugError("Error setting up request:", error.message);
      }
    }

    return [];
  }
};
