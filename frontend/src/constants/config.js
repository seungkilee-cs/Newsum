export const isStaging = import.meta.env.VITE_APP_ENVIRONMENT === "staging";

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export const articleEndpoint = "/api/articles/mongo";
export const siteEndpoint = "/api/sites";

export const authEndpoints = {
  register: "/api/users/register",
  login: "/api/users/login",
  logout: "/api/users/logout",
};
