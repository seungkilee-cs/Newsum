import axios from "axios";
import { isStaging, siteEndpoint } from "../constants/config";
// import mockSites from "../data/siteData";
import { sites } from "../data/siteData.js";

export const fetchSites = async () => {
  try {
    let fetchedSites = [];

    if (isStaging) {
      console.log("Using mock site data in staging environment");
      fetchedSites = sites;
      console.log("static sites:", fetchedSites);
    } else {
      console.log("Fetching site data from backend");
      console.log(`Sending request to: ${siteEndpoint}`);
      const response = await axios.get(siteEndpoint);
      console.log("Response received:", response);

      if (response.data && Array.isArray(response.data)) {
        fetchedSites = response.data;
      } else {
        console.error("Unexpected data format received:", response.data);
        throw new Error("Unexpected data format");
      }
    }

    return fetchedSites;
  } catch (error) {
    console.error("Error fetching sites:", error);
    console.error("Error fetching sites:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    return [];
  }
};
