import normalizeUrl from "normalize-url";

export const normalizeUrlCustom = (url) => {
  if (!url) return null;
  try {
    // Ensure the URL has a protocol
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
    return normalizeUrl(urlWithProtocol, { stripWWW: false });
  } catch (error) {
    console.error("Error normalizing URL:", error);
    return url; // Return original URL if normalization fails
  }
};
