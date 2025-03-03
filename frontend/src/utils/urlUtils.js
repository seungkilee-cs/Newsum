import normalizeUrl from "normalize-url";

export const normalizeUrlCustom = (url) => {
  if (!url) return null;
  try {
    return normalizeUrl(url, { stripWWW: false });
  } catch (error) {
    console.error("Error normalizing URL:", error);
    return url; // Return original URL if normalization fails
  }
};
