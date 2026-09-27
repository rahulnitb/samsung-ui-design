import { useEffect } from 'react';
import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { getSettingValue, hasOverlay, isMainFocused, makeTarget } from '../navigation/selectors.js';
import { heroSlides, HERO_INTERVAL_MS } from '../data/heroData.js';
import FocusIndicator from './FocusIndicator.jsx';
import './HeroCarousel.css';

/** Promo banner: one full-bleed key-art background per slide, title/CTA bottom-left. */
export default function HeroCarousel({ rowIndex }) {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const { heroIndex } = state;
  const slide = heroSlides[heroIndex];
  const focused = isMainFocused(state, rowIndex, 0);
  const autoplay = !hasOverlay(state) && getSettingValue(state, 'heroAutoplay') === 'On';

  // Restarting the timer on every slide change means manual browsing resets the countdown.
  useEffect(() => {
    if (!autoplay) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'HERO_NEXT' }), HERO_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [autoplay, heroIndex, dispatch]);

  return (
    <section
      className={`hero ${autoplay ? 'hero--autoplay' : ''}`}
      data-row={rowIndex}
      style={{
        '--hero-interval': `${HERO_INTERVAL_MS}ms`,
        '--sky': slide.palette[0],
        '--glow': slide.palette[1],
        '--ground': slide.palette[2],
        '--accent': slide.accent,
      }}
    >
      <div className="hero__art" aria-hidden="true" key={`art-${slide.id}`}>
        {slide.image && <img src={slide.image} alt="" />}
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__dots">
        {heroSlides.map((item, index) => (
          <span
            key={item.id}
            className={`hero__dot ${index === heroIndex ? 'is-active' : ''}`}
            onClick={() => dispatch({ type: 'HERO_SET', index })}
          />
        ))}
      </div>

      <div className="hero__content" key={`content-${slide.id}`}>
        {slide.tag && <span className="hero__tag">{slide.tag}</span>}
        <h1 className="hero__title">{slide.title}</h1>
        <div className="hero__row">
          <span className="hero__provider" style={{ '--provider-color': slide.providerColor }}>
            {slide.provider}
          </span>
          <FocusIndicator
            variant="fill"
            focused={focused}
            target={makeTarget('main', rowIndex, 0)}
            className="hero__cta"
          >
            {slide.cta}
          </FocusIndicator>
        </div>
      </div>
    </section>
  );
}
