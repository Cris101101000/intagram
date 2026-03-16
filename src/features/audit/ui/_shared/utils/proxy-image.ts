/**
 * Returns a proxied URL for Instagram CDN images to avoid hotlink blocking.
 */
export function proxyImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}
