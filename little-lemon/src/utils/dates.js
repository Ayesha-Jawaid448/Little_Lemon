/** Date helpers. All dates are handled in the visitor's local time zone. */

/** Formats a Date as the "YYYY-MM-DD" string used by <input type="date">. */
export function toDateInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parses "YYYY-MM-DD" into a local Date. Returns null for anything that is not
 * a real calendar date (e.g. "2026-02-30" or "").
 */
export function parseDateInput(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const isReal = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  return isReal ? date : null;
}

/** Returns midnight (local) at the start of the given day. */
export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Returns a new Date `days` days after `date` (negative values go back). */
export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** "18:30" -> "6:30 pm" */
export function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** "2026-10-05" -> "Monday, October 5, 2026" */
export function formatLongDate(value) {
  const date = parseDateInput(value);
  if (!date) return value;
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
