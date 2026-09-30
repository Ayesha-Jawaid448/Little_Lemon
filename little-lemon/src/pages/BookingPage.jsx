import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { submitBooking } from '../utils/api';
import { initializeTimes, updateTimes } from '../utils/times';

export default function BookingPage() {
  const navigate = useNavigate();
  const [availableTimes, dispatch] = useReducer(updateTimes, undefined, () => initializeTimes());

  function submitForm(values) {
    const result = submitBooking(values);
    if (result.ok) {
      navigate('/confirmed', { state: { booking: values } });
    }
    return result;
  }

  return (
    <div className="container page booking-page">
      <h1>Reserve a table</h1>
      <p className="lede">
        Choose a date and time and we will hold a table for you. We seat guests from 5:00 pm.
      </p>
      <BookingForm availableTimes={availableTimes} dispatch={dispatch} submitForm={submitForm} />
    </div>
  );
}
