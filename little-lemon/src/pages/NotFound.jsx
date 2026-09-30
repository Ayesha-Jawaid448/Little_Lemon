import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page">
      <h1>Page not found</h1>
      <p className="lede">That page does not exist. Try the home page or make a reservation.</p>
      <Link to="/" className="btn btn-primary">
        Go to home page
      </Link>
    </div>
  );
}
