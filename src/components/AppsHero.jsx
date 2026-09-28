import './AppsHero.css';

/**
 * The Apps page's promotional banner — illustrated, not photographic, and purely
 * decorative (no focusable items), matching Samsung's own "Explore Smart Hub" banner
 * on the real Apps tab. Rendered as a zero-item row so remote nav skips over it
 * (see navigation/grid.js's moveFocus) while it still scrolls into view correctly.
 */
export default function AppsHero({ rowIndex }) {
  return (
    <section className="apps-hero" data-row={rowIndex} aria-hidden="true">
      <div className="apps-hero__shapes">
        <span className="apps-hero__leaf apps-hero__leaf--1" />
        <span className="apps-hero__leaf apps-hero__leaf--2" />
        <span className="apps-hero__petal" />
        <span className="apps-hero__ring" />
        <span className="apps-hero__dot apps-hero__dot--1" />
        <span className="apps-hero__dot apps-hero__dot--2" />
      </div>
      <div className="apps-hero__text">
        <h1 className="apps-hero__title">Explore your favourite content quickly and easily</h1>
        <p className="apps-hero__subtitle">
          Everything you want is here — enjoy a range of apps and content with Smart Hub.
        </p>
      </div>
    </section>
  );
}
