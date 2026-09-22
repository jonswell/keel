import type { Team } from '@/types';

export const CARDINAL: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export type GridCell = {
  key: string;
  x: number;
  y: number;
  team?: Team;
};

export function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function visibleCells(teams: Team[]): GridCell[] {
  const hosted = teams.filter((team) => (team.role ?? 'host') !== 'member');
  const byKey = new Map(hosted.map((team) => [cellKey(team.gridX, team.gridY), team]));
  const cells = new Map<string, GridCell>();

  for (const team of hosted) {
    const key = cellKey(team.gridX, team.gridY);
    cells.set(key, { key, x: team.gridX, y: team.gridY, team });
    for (const [dx, dy] of CARDINAL) {
      const x = team.gridX + dx;
      const y = team.gridY + dy;
      const neighbor = cellKey(x, y);
      if (!cells.has(neighbor)) {
        cells.set(neighbor, { key: neighbor, x, y, team: byKey.get(neighbor) });
      }
    }
  }

  return [...cells.values()];
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '+';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function hueFromName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}
