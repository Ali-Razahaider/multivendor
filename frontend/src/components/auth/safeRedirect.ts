// Only allow same-site relative paths as post-login destinations.
export const safeRedirect = (value: string | null, fallback = '/') =>
  value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : fallback;
