/** Clearbit Logo API — domain in, PNG out. Missing brands 404. */
export function domainFromPlace(place: string): string | null {
  const raw = place.trim().toLowerCase();
  if (!raw) return null;

  const host = raw.replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[/?#]/)[0];
  if (host.includes('.') && /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(host)) return host;

  const slug = raw.replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '');
  if (slug.length < 2) return null;
  return `${slug}.com`;
}

export function clearbitLogoUrl(place: string, size = 128): string | null {
  const domain = domainFromPlace(place);
  if (!domain) return null;
  return `https://logo.clearbit.com/${encodeURIComponent(domain)}?size=${size}`;
}
