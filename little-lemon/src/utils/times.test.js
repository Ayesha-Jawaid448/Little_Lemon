import { fetchAPI, submitBooking } from './api';
import { addDays, toDateInputValue } from './dates';
import { initializeTimes, updateTimes } from './times';

const day = new Date(2026, 9, 5);

describe('initializeTimes', () => {
  it('returns an array of HH:MM slots', () => {
    const times = initializeTimes(day);
    expect(Array.isArray(times)).toBe(true);
    times.forEach((time) => expect(time).toMatch(/^\d{2}:\d{2}$/));
  });

  it('is deterministic for the same day', () => {
    expect(initializeTimes(day)).toEqual(initializeTimes(day));
  });
});

describe('updateTimes', () => {
  it('loads the slots for the newly selected date', () => {
    const next = updateTimes([], { type: 'date_changed', date: '2026-10-05' });
    expect(next).toEqual(fetchAPI(day));
  });

  it('returns an empty list for an invalid date', () => {
    expect(updateTimes(['17:00'], { type: 'date_changed', date: '' })).toEqual([]);
  });

  it('returns the current state for unknown actions', () => {
    const state = ['17:00'];
    expect(updateTimes(state, { type: 'unknown' })).toBe(state);
  });
});

describe('submitBooking', () => {
  // Find a day that has at least one slot so the test is not tied to a fixed date.
  function firstDayWithSlots() {
    for (let i = 1; i < 60; i += 1) {
      const date = addDays(new Date(2026, 9, 1), i);
      if (fetchAPI(date).length > 0) return date;
    }
    throw new Error('No day with slots found');
  }

  it('returns ok and removes the booked slot from later searches', () => {
    const date = firstDayWithSlots();
    const [slot] = fetchAPI(date);

    const result = submitBooking({ date: toDateInputValue(date), time: slot });

    expect(result).toEqual({ ok: true });
    expect(fetchAPI(date)).not.toContain(slot);
  });

  it('still succeeds when localStorage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(submitBooking({ date: '2026-10-05', time: '17:00' })).toEqual({ ok: true });
  });

  it('tolerates corrupted stored data', () => {
    window.localStorage.setItem('littleLemonBookings', '{not json');
    expect(() => fetchAPI(day)).not.toThrow();
  });
});
