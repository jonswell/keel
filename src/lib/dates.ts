const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const monthDay = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric' });
const shortDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatToday(date = new Date()): { weekday: string; monthDay: string } {
  return {
    weekday: weekday.format(date),
    monthDay: monthDay.format(date),
  };
}

export function formatLogDate(key: string): string {
  const [year, month, day] = key.split('-').map(Number);
  return shortDate.format(new Date(year, month - 1, day));
}

export function dayPart(date = new Date()): 'morning' | 'afternoon' | 'evening' {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
