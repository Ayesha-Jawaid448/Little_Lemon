import { addDays, formatLongDate, formatTime, parseDateInput, toDateInputValue } from './dates';

describe('dates', () => {
  it('formats a Date as YYYY-MM-DD with zero padding', () => {
    expect(toDateInputValue(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('parses real dates and rejects impossible ones', () => {
    expect(parseDateInput('2026-10-05')).toEqual(new Date(2026, 9, 5));
    expect(parseDateInput('2026-02-30')).toBeNull();
    expect(parseDateInput('')).toBeNull();
    expect(parseDateInput('05/10/2026')).toBeNull();
  });

  it('adds days across month boundaries', () => {
    expect(toDateInputValue(addDays(new Date(2026, 0, 30), 3))).toBe('2026-02-02');
  });

  it('formats times in 12-hour style', () => {
    expect(formatTime('17:00')).toBe('5:00 pm');
    expect(formatTime('23:30')).toBe('11:30 pm');
    expect(formatTime('12:00')).toBe('12:00 pm');
  });

  it('formats a long date and falls back to the raw value when invalid', () => {
    expect(formatLongDate('2026-10-05')).toContain('October');
    expect(formatLongDate('nope')).toBe('nope');
  });
});
