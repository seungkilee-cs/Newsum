const axios = require("axios");
const { sites } = require("../data/siteData"); // Adjust path as needed

const insertSites = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5001/mongo-sites",
      sites,
    );
    console.log("Response from server:", response.data);
  } catch (error) {
    console.error(
      "Error inserting sites:",
      error.response?.data || error.message,
    );
  }
};

insertSites();
