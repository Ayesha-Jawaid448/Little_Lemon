import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from './BookingForm';
import { addDays, toDateInputValue } from '../utils/dates';

const TIMES = ['17:00', '18:00', '19:30'];
const FUTURE_DATE = toDateInputValue(addDays(new Date(), 7));

function setup(props = {}) {
  const dispatch = vi.fn();
  const submitForm = vi.fn(() => ({ ok: true }));
  const user = userEvent.setup();
  render(
    <BookingForm availableTimes={TIMES} dispatch={dispatch} submitForm={submitForm} {...props} />,
  );
  return { dispatch, submitForm, user };
}

async function fillValidForm(user) {
  await user.type(screen.getByLabelText(/full name/i), '  Ada Lovelace ');
  await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
  fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: FUTURE_DATE } });
  await user.selectOptions(screen.getByLabelText(/^time/i), '18:00');
  await user.selectOptions(screen.getByLabelText(/occasion/i), 'Anniversary');
}

describe('BookingForm rendering and accessibility', () => {
  it('renders every field with an associated label', () => {
    setup();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reserve table/i })).toBeInTheDocument();
  });

  it('exposes the form as a named landmark', () => {
    setup();
    expect(screen.getByRole('form', { name: /table reservation/i })).toBeInTheDocument();
  });

  it('marks required fields for assistive technology', () => {
    setup();
    ['full name', 'email', '^date', '^time', 'number of guests'].forEach((label) => {
      expect(screen.getByLabelText(new RegExp(label, 'i'))).toBeRequired();
    });
    expect(screen.getByLabelText(/occasion/i)).not.toBeRequired();
  });

  it('applies HTML validation attributes to date and guests', () => {
    setup();
    const guests = screen.getByLabelText(/number of guests/i);
    expect(guests).toHaveAttribute('type', 'number');
    expect(guests).toHaveAttribute('min', '1');
    expect(guests).toHaveAttribute('max', '10');
    expect(screen.getByLabelText(/^date/i)).toHaveAttribute('min', toDateInputValue(new Date()));
  });

  it('lists the available times as options', () => {
    setup();
    const options = screen.getAllByRole('option').map((option) => option.getAttribute('value'));
    expect(options).toEqual(expect.arrayContaining(TIMES));
  });
});

describe('BookingForm behaviour', () => {
  it('dispatches date_changed when the date changes', () => {
    const { dispatch } = setup();
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: FUTURE_DATE } });
    expect(dispatch).toHaveBeenCalledWith({ type: 'date_changed', date: FUTURE_DATE });
  });

  it('disables the time picker and explains why when no tables are free', () => {
    setup({ availableTimes: [] });
    expect(screen.getByLabelText(/^time/i)).toBeDisabled();
    expect(screen.getByText(/no tables are available on this date/i)).toBeInTheDocument();
  });

  it('submits trimmed, typed values when the form is valid', async () => {
    const { submitForm, user } = setup();
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /reserve table/i }));

    expect(submitForm).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      date: FUTURE_DATE,
      time: '18:00',
      guests: 2,
      occasion: 'Anniversary',
    });
  });
});

describe('BookingForm validation', () => {
  it('blocks an empty submit, shows messages, and focuses the first invalid field', async () => {
    const { submitForm, user } = setup();
    await user.click(screen.getByRole('button', { name: /reserve table/i }));

    expect(submitForm).not.toHaveBeenCalled();
    expect(screen.getByText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/choose a time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveFocus();
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('links each error to its field with aria-describedby', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /reserve table/i }));
    const name = screen.getByLabelText(/full name/i);
    expect(name).toHaveAccessibleDescription(/enter your full name/i);
  });

  it('rejects an invalid email address', async () => {
    const { submitForm, user } = setup();
    await fillValidForm(user);
    const email = screen.getByLabelText(/email/i);
    await user.clear(email);
    await user.type(email, 'not-an-email');
    await user.click(screen.getByRole('button', { name: /reserve table/i }));

    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it('rejects a date in the past', async () => {
    const { submitForm, user } = setup();
    await fillValidForm(user);
    fireEvent.change(screen.getByLabelText(/^date/i), { target: { value: '2000-01-01' } });
    await user.click(screen.getByRole('button', { name: /reserve table/i }));

    expect(screen.getByText(/choose today or a future date/i)).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it('rejects a guest count outside 1 to 10', async () => {
    const { submitForm, user } = setup();
    await fillValidForm(user);
    const guests = screen.getByLabelText(/number of guests/i);
    await user.clear(guests);
    await user.type(guests, '11');
    await user.click(screen.getByRole('button', { name: /reserve table/i }));

    expect(screen.getByText(/between 1 and 10 guests/i)).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it('clears an error as soon as the value becomes valid', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /reserve table/i }));
    expect(screen.getByText(/enter your full name/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/full name/i), 'Ada');
    expect(screen.queryByText(/enter your full name/i)).not.toBeInTheDocument();
  });

  it('shows a meaningful message when the booking service fails', async () => {
    const { user } = setup({
      submitForm: vi.fn(() => ({ ok: false, message: 'The booking service is unavailable.' })),
    });
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /reserve table/i }));

    expect(await screen.findByText(/booking service is unavailable/i)).toBeInTheDocument();
  });
});
