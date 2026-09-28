import './LiveHero.css';

/** The Live page's promotional banner — same illustrated language as the Apps
 * page's banner (see AppsHero.jsx), warm-tinted for "live broadcast" instead of
 * Apps' blue. Purely decorative: a zero-item row that remote nav skips over. */
export default function LiveHero({ rowIndex }) {
  return (
    <section className="live-hero" data-row={rowIndex} aria-hidden="true">
      <div className="live-hero__shapes">
        <span className="live-hero__beam live-hero__beam--1" />
        <span className="live-hero__beam live-hero__beam--2" />
        <span className="live-hero__ring" />
        <span className="live-hero__dot" />
      </div>
      <div className="live-hero__text">
        <h1 className="live-hero__title">Live TV, all in one place</h1>
        <p className="live-hero__subtitle">
          News, sports and entertainment — live, no waiting. Just pick a channel and watch.
        </p>
      </div>
    </section>
  );
}
