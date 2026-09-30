import { addDays, parseDateInput, startOfDay } from './dates';

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 10;
export const MAX_DAYS_AHEAD = 180;
export const OCCASIONS = ['Birthday', 'Anniversary', 'Engagement', 'Other'];

/** The order fields appear on screen; used to focus the first invalid one. */
export const FIELD_ORDER = ['name', 'email', 'date', 'time', 'guests', 'occasion'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates a single field and returns an error message, or '' when valid.
 *
 * @param {string} name   field name
 * @param {object} values all form values (strings)
 * @param {{availableTimes?: string[], today?: Date}} context
 */
export function validateField(name, values, { availableTimes = [], today = new Date() } = {}) {
  const value = values[name] ?? '';

  switch (name) {
    case 'name': {
      const trimmed = value.trim();
      if (!trimmed) return 'Enter your full name.';
      if (trimmed.length < 2) return 'Enter at least 2 characters.';
      if (trimmed.length > 60) return 'Name is too long (60 characters maximum).';
      return '';
    }

    case 'email': {
      const trimmed = value.trim();
      if (!trimmed) return 'Enter your email address.';
      if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email, like name@example.com.';
      return '';
    }

    case 'date': {
      if (!value) return 'Choose a date.';
      const date = parseDateInput(value);
      if (!date) return 'Enter a valid date.';
      const todayStart = startOfDay(today);
      if (date < todayStart) return 'Choose today or a future date.';
      if (date > addDays(todayStart, MAX_DAYS_AHEAD)) {
        return `We take bookings up to ${Math.round(MAX_DAYS_AHEAD / 30)} months ahead.`;
      }
      return '';
    }

    case 'time': {
      if (availableTimes.length === 0) {
        return 'No tables are available on this date. Choose another date.';
      }
      if (!value) return 'Choose a time.';
      if (!availableTimes.includes(value)) return 'Choose one of the available times.';
      return '';
    }

    case 'guests': {
      if (String(value).trim() === '') return 'Enter the number of guests.';
      if (!/^\d+$/.test(String(value).trim())) return 'Enter a whole number of guests.';
      const guests = Number(value);
      if (guests < MIN_GUESTS || guests > MAX_GUESTS) {
        return `Choose between ${MIN_GUESTS} and ${MAX_GUESTS} guests.`;
      }
      return '';
    }

    case 'occasion':
      // Optional: empty means "no occasion".
      if (value !== '' && !OCCASIONS.includes(value)) return 'Choose an occasion from the list.';
      return '';

    default:
      return '';
  }
}

/** Validates every field. Returns an object of { fieldName: message } for invalid fields only. */
export function validateBooking(values, context) {
  const errors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, values, context);
    if (message) errors[field] = message;
  }
  return errors;
}
