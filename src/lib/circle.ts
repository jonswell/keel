import { ALL_SERVICES_ID, SERVICE_CATEGORY_LABEL, getServices, type Service } from '@/data/services';
import { getSources, type SharedSource } from '@/data/sources';
import type { DiscountCode, Team } from '@/types';

export type CircleItem =
  | { kind: 'service'; id: string; name: string; service: Service }
  | { kind: 'source'; id: string; name: string; source: SharedSource }
  | { kind: 'discount'; id: string; name: string; discount: DiscountCode };

export function circleItems(team?: Team): CircleItem[] {
  const services = getServices(team?.serviceIds ?? []).map((service) => ({
    kind: 'service' as const,
    id: service.id,
    name: service.name,
    service,
  }));
  const sources = getSources(team?.sourceIds ?? []).map((source) => ({
    kind: 'source' as const,
    id: source.id,
    name: source.name,
    source,
  }));
  const discounts = (team?.discountCodes ?? [])
    .filter((item) => item.place.trim() || item.code.trim())
    .map((item) => ({
      kind: 'discount' as const,
      id: item.id,
      name: item.place.trim() || item.code.trim(),
      discount: item,
    }));
  return [...services, ...sources, ...discounts];
}

export function shareKindLabel(item: CircleItem): string {
  if (item.kind === 'discount') return 'Code';
  if (item.kind === 'source') return 'Source';
  return SERVICE_CATEGORY_LABEL[item.service.category];
}

export function circleSlides(team?: Team): string[] {
  const ids = circleItems(team).map((item) => item.id);
  if (ids.length > 1) return [ALL_SERVICES_ID, ...ids];
  return ids;
}

export function circleIsDefined(team?: Team): boolean {
  if (!team) return false;
  return Boolean(
    team.name.trim() ||
      (team.description ?? '').trim() ||
      team.members.length ||
      team.serviceIds.length ||
      (team.sourceIds ?? []).length ||
      team.discountCodes.some((item) => item.place.trim() || item.code.trim()),
  );
}
