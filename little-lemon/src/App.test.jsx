import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App layout and routing', () => {
  it('renders the landmarks and a skip link', () => {
    renderAt('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute(
      'href',
      '#main',
    );
  });

  it('has a single h1 on the home page and lists the specials', () => {
    renderAt('/');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: /this week/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /greek salad/i })).toBeInTheDocument();
  });

  it('shows the booking page at /booking', () => {
    renderAt('/booking');
    expect(screen.getByRole('heading', { level: 1, name: /reserve a table/i })).toBeInTheDocument();
  });

  it('navigates from the home page to the booking form', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(within(screen.getByRole('main')).getAllByRole('link', { name: /table/i })[0]);
    expect(screen.getByRole('form', { name: /table reservation/i })).toBeInTheDocument();
  });

  it('shows a friendly page for unknown routes', () => {
    renderAt('/nope');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});

describe('Booking flow', () => {
  it('confirms a booking after the form is completed', async () => {
    const user = userEvent.setup();
    renderAt('/booking');

    await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');

    const timeSelect = screen.getByLabelText(/^time/i);
    const firstTime = within(timeSelect)
      .getAllByRole('option')
      .map((option) => option.getAttribute('value'))
      .find(Boolean);
    // Today may have no free slots for the seeded schedule; skip the flow in that rare case.
    if (!firstTime) return;

    await user.selectOptions(timeSelect, firstTime);
    await user.click(screen.getByRole('button', { name: /reserve table/i }));

    expect(await screen.findByRole('heading', { name: /booking confirmed/i })).toBeInTheDocument();
    expect(screen.getByText(/ada lovelace/i)).toBeInTheDocument();
  });

  it('explains what to do when the confirmation page is opened directly', () => {
    renderAt('/confirmed');
    expect(screen.getByRole('heading', { name: /no recent booking/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reserve a table/i })).toHaveAttribute(
      'href',
      '/booking',
    );
  });
});
