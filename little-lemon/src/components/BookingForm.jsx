import { useRef, useState } from 'react';
import { formatTime, toDateInputValue, addDays } from '../utils/dates';
import {
  FIELD_ORDER,
  MAX_DAYS_AHEAD,
  MAX_GUESTS,
  MIN_GUESTS,
  OCCASIONS,
  validateBooking,
  validateField,
} from '../utils/validation';

/**
 * Table reservation form.
 *
 * Props
 * - availableTimes: string[]        open slots for the selected date
 * - dispatch: (action) => void      called with { type: 'date_changed', date } when the date changes
 * - submitForm: (values) => { ok: boolean, message?: string } | void
 *
 * Validation runs when a field loses focus, live once a field has an error, and
 * for the whole form on submit (focus then moves to the first invalid field).
 */
export default function BookingForm({ availableTimes, dispatch, submitForm }) {
  const now = new Date();
  const minDate = toDateInputValue(now);
  const maxDate = toDateInputValue(addDays(now, MAX_DAYS_AHEAD));

  const [values, setValues] = useState({
    name: '',
    email: '',
    date: minDate,
    time: '',
    guests: '2',
    occasion: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const fieldRefs = useRef({});

  const context = { availableTimes };

  function setError(prev, name, message) {
    const next = { ...prev };
    if (message) next[name] = message;
    else delete next[name];
    return next;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };

    if (name === 'date') {
      // The list of times changes with the date, so any earlier choice is no longer valid.
      nextValues.time = '';
      dispatch({ type: 'date_changed', date: value });
    }

    setValues(nextValues);
    setSubmitError('');
    setErrors((prev) => {
      let next = prev;
      if (name === 'date') next = setError(next, 'time', '');
      if (prev[name]) next = setError(next, name, validateField(name, nextValues, context));
      return next;
    });
  }

  function handleBlur(event) {
    const { name } = event.target;
    setErrors((prev) => setError(prev, name, validateField(name, values, context)));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    const found = validateBooking(values, context);
    setErrors(found);

    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    const result = submitForm({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      guests: Number(values.guests),
    });
    if (result && result.ok === false) {
      setSubmitError(result.message || 'We could not complete your booking. Please try again.');
    }
  }

  // Props shared by every control: wiring for state, validation, and screen readers.
  function controlProps(name, hintId) {
    const describedBy = [hintId, errors[name] ? `${name}-error` : null].filter(Boolean).join(' ');
    return {
      id: `booking-${name}`,
      name,
      value: values[name],
      ref: (el) => {
        fieldRefs.current[name] = el;
      },
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': errors[name] ? 'true' : 'false',
      'aria-describedby': describedBy || undefined,
    };
  }

  function renderError(name) {
    return errors[name] ? (
      <p id={`${name}-error`} className="field-error" role="alert">
        {errors[name]}
      </p>
    ) : null;
  }

  const timesHint = !values.date
    ? 'Choose a date to see available times.'
    : availableTimes.length === 0
      ? 'No tables are available on this date. Try another day.'
      : `${availableTimes.length} time${availableTimes.length === 1 ? '' : 's'} available.`;

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate aria-label="Table reservation">
      <p className="form-note">Fields marked with an asterisk (*) are required.</p>

      <div className="field">
        <label htmlFor="booking-name">
          Full name <span aria-hidden="true">*</span>
        </label>
        <input type="text" autoComplete="name" required aria-required="true" {...controlProps('name')} />
        {renderError('name')}
      </div>

      <div className="field">
        <label htmlFor="booking-email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          {...controlProps('email')}
        />
        {renderError('email')}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="booking-date">
            Date <span aria-hidden="true">*</span>
          </label>
          <input
            type="date"
            min={minDate}
            max={maxDate}
            required
            aria-required="true"
            {...controlProps('date')}
          />
          {renderError('date')}
        </div>

        <div className="field">
          <label htmlFor="booking-time">
            Time <span aria-hidden="true">*</span>
          </label>
          <select
            required
            aria-required="true"
            disabled={availableTimes.length === 0}
            {...controlProps('time', 'time-hint')}
          >
            <option value="">Select a time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {formatTime(time)}
              </option>
            ))}
          </select>
          <p id="time-hint" className="field-hint" aria-live="polite">
            {timesHint}
          </p>
          {renderError('time')}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="booking-guests">
            Number of guests <span aria-hidden="true">*</span>
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={MIN_GUESTS}
            max={MAX_GUESTS}
            step="1"
            required
            aria-required="true"
            {...controlProps('guests', 'guests-hint')}
          />
          <p id="guests-hint" className="field-hint">
            {MIN_GUESTS} to {MAX_GUESTS} guests. For larger groups, call us.
          </p>
          {renderError('guests')}
        </div>

        <div className="field">
          <label htmlFor="booking-occasion">Occasion</label>
          <select {...controlProps('occasion')}>
            <option value="">No occasion</option>
            {OCCASIONS.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {submitError && (
        <p className="form-error" role="alert">
          {submitError}
        </p>
      )}

      <button type="submit" className="btn btn-primary">
        Reserve table
      </button>
    </form>
  );
}
