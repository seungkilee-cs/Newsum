export const DEBUG = false; // Toggle to enable detailed logging during development

export const isDebugEnabled = () => DEBUG;

export function debugLog(...args) {
  if (isDebugEnabled()) {
    console.log(...args);
  }
}

export function debugError(...args) {
  if (isDebugEnabled()) {
    console.error(...args);
  }
}
