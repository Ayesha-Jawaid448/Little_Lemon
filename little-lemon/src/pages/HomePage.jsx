import { Link } from 'react-router-dom';
import LemonSlice from '../components/LemonSlice';

const SPECIALS = [
  {
    name: 'Greek salad',
    price: '$12.99',
    description:
      'Crisp romaine, tomatoes, cucumber, and feta, finished with garlic-rubbed croutons and olive oil.',
  },
  {
    name: 'Bruschetta',
    price: '$5.99',
    description: 'Grilled bread rubbed with garlic and topped with sea salt, tomato, and basil.',
  },
  {
    name: 'Lemon dessert',
    price: '$5.00',
    description: "Grandma's lemon cake, baked from the recipe that started the restaurant.",
  },
];

const TESTIMONIALS = [
  { quote: 'The lemon dessert alone is worth the trip across town.', author: 'Priya, Chicago' },
  { quote: 'Warm service, a lovely room, and a Greek salad I still think about.', author: 'Marcus, Evanston' },
  { quote: 'We booked online in under a minute and the table was ready when we arrived.', author: 'Elena, Oak Park' },
];

export default function HomePage() {
  return (
    <>
      <section className="hero on-dark" aria-labelledby="hero-heading">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1 id="hero-heading">Little Lemon</h1>
            <p className="hero-city">Chicago</p>
            <p className="hero-text">
              A family-run Mediterranean kitchen serving traditional recipes with a modern twist.
              Come for dinner, stay for the lemon dessert.
            </p>
            <Link to="/booking" className="btn btn-primary">
              Reserve a table
            </Link>
          </div>
          <LemonSlice className="hero-art" />
        </div>
      </section>

      <section id="specials" className="section container" aria-labelledby="specials-heading">
        <div className="section-head">
          <h2 id="specials-heading">This week&rsquo;s specials</h2>
          <Link to="/booking" className="btn btn-secondary">
            Book a table
          </Link>
        </div>
        <ul className="specials-list">
          {SPECIALS.map((dish) => (
            <li key={dish.name} className="special">
              <article>
                <div className="special-head">
                  <h3>{dish.name}</h3>
                  <p className="price">{dish.price}</p>
                </div>
                <p>{dish.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="section testimonials" aria-labelledby="testimonials-heading">
        <div className="container">
          <h2 id="testimonials-heading">What guests say</h2>
          <ul className="testimonial-list">
            {TESTIMONIALS.map((item) => (
              <li key={item.author}>
                <figure>
                  <blockquote>
                    <p>{item.quote}</p>
                  </blockquote>
                  <figcaption>{item.author}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="section container about" aria-labelledby="about-heading">
        <h2 id="about-heading">About Little Lemon</h2>
        <p>
          Little Lemon is owned by two brothers, Mario and Adrian, who grew up cooking together in
          their family&rsquo;s kitchen. Their menu follows the recipes they learned there, updated
          with seasonal Chicago produce.
        </p>
        <p>
          We seat guests every evening from 5:00 pm. Tables fill up quickly on weekends, so we
          recommend reserving ahead.
        </p>
      </section>
    </>
  );
}
