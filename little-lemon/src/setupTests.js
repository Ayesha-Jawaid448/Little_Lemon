import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';

// jsdom does not implement scrolling; stub it so tests stay quiet.
window.scrollTo = vi.fn();

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});
