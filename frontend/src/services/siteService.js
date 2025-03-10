import axios from "axios";
import { isStaging, siteEndpoint } from "../constants/config";
import mockSites from "../data/siteData";

export const fetchSites = async () => {
  try {
    let fetchedSites = [];

    if (isStaging) {
      console.log("Using mock site data in staging environment");
      fetchedSites = mockSites;
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
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return [];
  }
};
