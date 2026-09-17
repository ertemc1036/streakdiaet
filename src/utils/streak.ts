import { addDays, todayKey, toKey } from './date';

/**
 * Counts consecutive active days ending today or yesterday.
 * Today not being logged yet doesn't break a streak still in progress.
 */
export function computeStreak(activeDates: Set<string>): number {
  const today = todayKey();
  let cursor = new Date();
  if (!activeDates.has(today)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (activeDates.has(toKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
