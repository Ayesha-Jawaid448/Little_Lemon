import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="container footer-grid">
        <div>
          <p className="footer-title">Little Lemon</p>
          <address>
            123 Lakeside Avenue
            <br />
            Chicago, IL 60601
            <br />
            <a href="tel:+13125550142">(312) 555-0142</a>
            <br />
            <a href="mailto:hello@littlelemon.example">hello@littlelemon.example</a>
          </address>
        </div>

        <nav aria-label="Footer">
          <p className="footer-title">Explore</p>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/#about">About</Link>
            </li>
            <li>
              <Link to="/#specials">Menu</Link>
            </li>
            <li>
              <Link to="/booking">Reservations</Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="footer-title">Opening hours</p>
          <p>
            Every day, 5:00 pm to midnight.
            <br />
            Last table at 11:30 pm.
          </p>
        </div>
      </div>
    </footer>
  );
}
