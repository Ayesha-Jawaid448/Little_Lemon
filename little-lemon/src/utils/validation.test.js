import { addDays, toDateInputValue } from './dates';
import { validateBooking, validateField } from './validation';

const today = new Date(2026, 9, 1);
const times = ['17:00', '18:30'];
const context = { availableTimes: times, today };

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  date: toDateInputValue(addDays(today, 3)),
  time: '18:30',
  guests: '4',
  occasion: 'Birthday',
};

describe('validateBooking', () => {
  it('accepts a complete, valid booking', () => {
    expect(validateBooking(valid, context)).toEqual({});
  });

  it('accepts an empty occasion because it is optional', () => {
    expect(validateBooking({ ...valid, occasion: '' }, context)).toEqual({});
  });

  it('reports every missing required field', () => {
    const errors = validateBooking(
      { name: '', email: '', date: '', time: '', guests: '', occasion: '' },
      context,
    );
    expect(Object.keys(errors).sort()).toEqual(['date', 'email', 'guests', 'name', 'time']);
  });
});

describe('validateField', () => {
  it('validates names', () => {
    expect(validateField('name', { name: ' ' }, context)).toMatch(/enter your full name/i);
    expect(validateField('name', { name: 'A' }, context)).toMatch(/at least 2/i);
    expect(validateField('name', { name: 'x'.repeat(61) }, context)).toMatch(/too long/i);
  });

  it('validates email format', () => {
    expect(validateField('email', { email: 'not-an-email' }, context)).toMatch(/valid email/i);
    expect(validateField('email', { email: 'a@b.co' }, context)).toBe('');
  });

  it('rejects past dates but accepts today', () => {
    expect(validateField('date', { date: '2026-09-30' }, context)).toMatch(/future date/i);
    expect(validateField('date', { date: '2026-10-01' }, context)).toBe('');
  });

  it('rejects impossible dates and dates too far ahead', () => {
    expect(validateField('date', { date: '2026-02-30' }, context)).toMatch(/valid date/i);
    expect(validateField('date', { date: '2030-01-01' }, context)).toMatch(/months ahead/i);
  });

  it('explains when there are no times on the chosen day', () => {
    const message = validateField('time', { time: '' }, { availableTimes: [], today });
    expect(message).toMatch(/no tables are available/i);
  });

  it('requires the time to be one of the available options', () => {
    expect(validateField('time', { time: '' }, context)).toMatch(/choose a time/i);
    expect(validateField('time', { time: '20:00' }, context)).toMatch(/available times/i);
  });

  it('enforces the guest range and whole numbers', () => {
    expect(validateField('guests', { guests: '0' }, context)).toMatch(/between 1 and 10/i);
    expect(validateField('guests', { guests: '11' }, context)).toMatch(/between 1 and 10/i);
    expect(validateField('guests', { guests: '2.5' }, context)).toMatch(/whole number/i);
    expect(validateField('guests', { guests: '-3' }, context)).toMatch(/whole number/i);
    expect(validateField('guests', { guests: '10' }, context)).toBe('');
  });

  it('rejects unknown occasions', () => {
    expect(validateField('occasion', { occasion: 'Hackathon' }, context)).toMatch(/from the list/i);
  });
});
