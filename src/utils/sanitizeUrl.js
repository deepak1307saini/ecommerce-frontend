export const sanitizeUrl = (url) => {
  if (!url) return null;
  return url.replace(/^"|"$/g, '');
};