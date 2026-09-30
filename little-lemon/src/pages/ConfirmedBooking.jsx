import { Link, useLocation } from 'react-router-dom';
import { formatLongDate, formatTime } from '../utils/dates';

export default function ConfirmedBooking() {
  const { state } = useLocation();
  const booking = state?.booking;

  // Reached by typing the URL or refreshing: there is nothing to confirm.
  if (!booking) {
    return (
      <div className="container page">
        <h1>No recent booking</h1>
        <p className="lede">We could not find a booking to show. You can make a new one below.</p>
        <Link to="/booking" className="btn btn-primary">
          Reserve a table
        </Link>
      </div>
    );
  }

  return (
    <div className="container page confirmed">
      <h1>Booking confirmed</h1>
      <p className="lede">
        Thank you, {booking.name}. We have reserved your table and will email a confirmation to{' '}
        {booking.email}.
      </p>

      <dl className="summary">
        <div>
          <dt>Date</dt>
          <dd>{formatLongDate(booking.date)}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{formatTime(booking.time)}</dd>
        </div>
        <div>
          <dt>Guests</dt>
          <dd>{booking.guests}</dd>
        </div>
        {booking.occasion && (
          <div>
            <dt>Occasion</dt>
            <dd>{booking.occasion}</dd>
          </div>
        )}
      </dl>

      <Link to="/" className="btn btn-secondary">
        Back to home
      </Link>
    </div>
  );
}
