import { hueFromName, initialsFromName } from '@/lib/grid';
import { defaultSplit } from '@/lib/split';
import type { Person, Team } from '@/types';

function person(id: string, name: string): Person {
  return {
    id,
    name,
    initials: initialsFromName(name),
    hue: hueFromName(name),
    source: 'new',
  };
}

function joined(partial: Omit<Team, 'role' | 'split' | 'discountCodes' | 'detailsById' | 'description' | 'sourceIds' | 'shareMetaById' | 'messages'> & Partial<Team>): Team {
  const team: Team = {
    description: '',
    sourceIds: [],
    split: defaultSplit(),
    discountCodes: [],
    detailsById: {},
    shareMetaById: {},
    messages: [],
    ...partial,
    role: 'member',
  };
  if (Object.keys(team.shareMetaById).length === 0) {
    const by = team.hostName?.trim() || 'Host';
    const at = '2026-03-14T12:00:00.000Z';
    const ids = [
      ...team.serviceIds,
      ...team.sourceIds,
      ...team.discountCodes.map((item) => item.id),
    ];
    team.shareMetaById = Object.fromEntries(ids.map((id) => [id, { addedAt: at, addedBy: by }]));
  }
  return team;
}

/** Circles this device was invited into. Stable ids so hydrate does not duplicate. */
export function sampleJoinedCircles(): Team[] {
  return [
    joined({
      id: 'joined_sunday',
      name: 'Sunday watch',
      gridX: 80,
      gridY: 0,
      hostName: 'Riley Chen',
      members: [person('joined_sunday_p1', 'Riley Chen'), person('joined_sunday_p2', 'Jordan Hale')],
      serviceIds: ['netflix'],
    }),
    joined({
      id: 'joined_league',
      name: 'League night',
      gridX: 81,
      gridY: 0,
      hostName: 'Casey Brooks',
      members: [person('joined_league_p1', 'Casey Brooks'), person('joined_league_p2', 'Sam Ortiz')],
      serviceIds: ['sleeper'],
    }),
    joined({
      id: 'joined_launch',
      name: 'Launch',
      gridX: 82,
      gridY: 0,
      hostName: 'Priya Shah',
      members: [
        person('joined_launch_p1', 'Priya Shah'),
        person('joined_launch_p2', 'Devon Walsh'),
        person('joined_launch_p3', 'Miles Reed'),
      ],
      serviceIds: ['slack'],
    }),
  ];
}
