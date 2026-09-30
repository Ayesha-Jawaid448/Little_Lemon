import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import BookingPage from './pages/BookingPage';
import ConfirmedBooking from './pages/ConfirmedBooking';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

/**
 * On navigation: scroll to a #hash target if there is one, otherwise go to the
 * top and move keyboard focus to <main> so screen reader users land on the new page.
 */
function NavigationEffects() {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView?.();
      return;
    }
    window.scrollTo(0, 0);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <NavigationEffects />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/confirmed" element={<ConfirmedBooking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
