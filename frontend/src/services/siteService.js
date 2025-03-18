import axios from "axios";
import { isStaging, siteEndpoint } from "../constants/config";
// import mockSites from "../data/siteData";
import { sites } from "../data/siteData.js";
import { debugLog, debugError } from "../utils/debugUtils";

export const fetchSites = async () => {
  try {
    let fetchedSites = [];

    if (isStaging) {
      debugLog("Using mock site data in staging environment");
      fetchedSites = sites;
      debugLog("static sites:", fetchedSites);
    } else {
      debugLog("Fetching site data from backend");
      debugLog(`Sending request to: ${siteEndpoint}`);
      const response = await axios.get(siteEndpoint);
      debugLog("Response received:", response);

      if (response.data && Array.isArray(response.data)) {
        fetchedSites = response.data;
      } else {
        debugError("Unexpected data format received:", response.data);
        throw new Error("Unexpected data format");
      }
    }

    return fetchedSites;
  } catch (error) {
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

    return [];
  }
};
