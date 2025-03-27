// export const isStaging = import.meta.env.VITE_APP_ENVIRONMENT === "staging";
export const isStaging = true;
export const test = true;
export const articleEndpoint = test
  ? "http://localhost:5001/api/articles/mongo"
  : "http://localhost:5001/api/articles";
export const siteEndpoint = "http://localhost:5001/api/sites";
