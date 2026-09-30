# Little Lemon

A responsive, accessible web app for **Little Lemon**, a family-run Mediterranean restaurant in Chicago. Visitors can browse the home page and **reserve a table** through a validated booking form.

Built with React 18, React Router 6, Vite, and Vitest + React Testing Library.

## Features

- **Home page** with hero, weekly specials, testimonials, and an About section.
- **Booking form** (`/booking`) with fields for name, email, date, time, number of guests, and occasion.
  - Available times update when the date changes (via a reducer: `initializeTimes` and `updateTimes`).
  - Times that were already booked disappear from later searches.
- **Confirmation page** (`/confirmed`) summarising the booking.
- **Friendly fallbacks**: a not-found page, and a helpful message if the confirmation page is opened without a booking.

## Getting started

Requires **Node.js 18 or newer**.

```bash
git clone <your-repository-url>
cd little-lemon
npm install
npm run dev        # start the dev server at http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm test` | Run all unit tests once |
| `npm run test:watch` | Re-run tests on change |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```
src/
  components/   BookingForm, Header, Footer, LemonSlice (decorative SVG)
  pages/        HomePage, BookingPage, ConfirmedBooking, NotFound
  utils/        api (mock booking API), times (reducer), validation, dates
  App.jsx       Layout, routes, skip link, focus management
  main.jsx      Entry point (BrowserRouter)
  index.css     Design tokens and all styles
```

## How the booking form validates

Validation rules live in `src/utils/validation.js` and are shared by the form and the tests.

| Field | Rule |
| --- | --- |
| Full name | Required, 2 to 60 characters |
| Email | Required, valid format |
| Date | Required, real calendar date, today or later, up to 6 months ahead |
| Time | Required, must be one of the available slots for the chosen date |
| Guests | Required, whole number from 1 to 10 |
| Occasion | Optional; must be one of the listed options |

Errors appear when a field loses focus, update live while the visitor fixes them, and are all checked on submit, when focus moves to the first invalid field.

### Edge cases handled

- No tables available on the chosen date: the time picker is disabled and the page explains why.
- Date changes reset the selected time so a stale time can never be submitted.
- Past dates, impossible dates (for example 30 February), and dates too far ahead are rejected.
- Non-integer, negative, and out-of-range guest counts are rejected.
- Booking service failure: the form shows an error message and keeps the visitor's input.
- `localStorage` blocked or corrupted: the app keeps working.
- Refreshing or directly opening `/confirmed`: a clear message instead of a blank page.

## Accessibility

- Semantic landmarks: `header`, `nav` (labelled), `main`, `footer`, with one `h1` per page and ordered headings.
- Skip link, and focus moves to `main` after navigating between pages.
- Every input has a visible `<label>`; required fields use `required` and `aria-required`.
- Errors use `role="alert"`, `aria-invalid`, and `aria-describedby` so screen readers announce them with the field.
- The available-times hint is an `aria-live` region.
- Visible focus rings, text contrast that meets WCAG AA, and `prefers-reduced-motion` respected.
- Decorative graphics are hidden from assistive technology (`aria-hidden`).

## Responsive design

Mobile-first CSS: single column on phones, with the form fields, specials, testimonials, and footer expanding to multiple columns from 640px and 832px wide.

## Testing

```bash
npm test
```

Tests cover:

- `utils/`: date helpers, validation rules, the times reducer, the mock API (including storage failures).
- `BookingForm`: labels and ARIA wiring, HTML validation attributes, date-change dispatch, success and failure submission, and each validation error.
- `App`: landmarks, routing, and the full booking flow through to confirmation.

## Design notes

The palette is Little Lemon's green and yellow. Typography pairs Markazi Text (headings) with Karla (body), loaded from Google Fonts with system-font fallbacks.

## Assumptions and limitations

- There is no real backend. `src/utils/api.js` simulates one: each day has a fixed set of slots, and confirmed bookings are stored in the browser's `localStorage`. Replace `fetchAPI` and `submitAPI` with real requests to go live.
- Slots on the current day that have already passed are not filtered out.
- Menu, About, and footer content is placeholder copy.
