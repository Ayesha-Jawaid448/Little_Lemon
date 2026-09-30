import { fetchAPI } from './api';
import { parseDateInput } from './dates';

/** Initial list of available times: the slots open today. */
export function initializeTimes(today = new Date()) {
  return fetchAPI(today);
}

/**
 * Reducer for the list of available times.
 * `date_changed` loads the slots for the newly selected date.
 */
export function updateTimes(state, action) {
  switch (action.type) {
    case 'date_changed': {
      const date = parseDateInput(action.date);
      return date ? fetchAPI(date) : [];
    }
    default:
      return state;
  }
}
