/**
 * A tiny in-browser stand-in for a booking API.
 *
 * - fetchAPI(date) returns the time slots that are open on a given day.
 * - submitAPI(values) "sends" a booking and returns true on success.
 * - submitBooking(values) wraps submitAPI, stores the booking locally so the
 *   slot disappears from later searches, and never throws.
 *
 * Swap these functions for real fetch() calls when a backend exists; the rest
 * of the app only depends on their return shapes.
 */
import { toDateInputValue } from './dates';

const STORAGE_KEY = 'littleLemonBookings';

/** Small deterministic pseudo-random generator so a given day always has the same slots. */
function seededRandom(seed) {
  const m = 2 ** 35 - 31;
  const a = 185852;
  let s = seed % m;
  return () => {
    s = (s * a) % m;
    return s / m;
  };
}

function readBookings() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Storage blocked or corrupted: behave as if nothing is booked yet.
    return [];
  }
}

/** Returns open slots ("17:00" ... "23:30") for the given Date, minus anything already booked. */
export function fetchAPI(date) {
  const seed = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  const random = seededRandom(seed);
  const slots = [];
  for (let hour = 17; hour <= 23; hour += 1) {
    if (random() < 0.5) slots.push(`${hour}:00`);
    if (random() < 0.5) slots.push(`${hour}:30`);
  }

  const day = toDateInputValue(date);
  const taken = new Set(
    readBookings()
      .filter((booking) => booking.date === day)
      .map((booking) => booking.time),
  );
  return slots.filter((slot) => !taken.has(slot));
}

/** Pretend to send the booking to a server. */
export function submitAPI() {
  return true;
}

/** Submits a booking. Always returns { ok: true } or { ok: false, message }. */
export function submitBooking(values) {
  try {
    if (!submitAPI(values)) {
      return { ok: false, message: 'We could not save your booking. Please try again.' };
    }
  } catch {
    return {
      ok: false,
      message: 'Something went wrong while booking. Check your connection and try again.',
    };
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...readBookings(), values]));
  } catch {
    // The booking succeeded; we just could not remember it locally.
  }
  return { ok: true };
}
