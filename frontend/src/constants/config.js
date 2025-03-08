export const isStaging = import.meta.env.VITE_APP_ENVIRONMENT === "staging";
export const test = true;
export const articleEndpoint = test
  ? "http://localhost:5001/mongo-articles"
  : "http://localhost:5001/articles";
export const siteEndpoint = "http://localhost:5001/mongo-sites";
