import { useEffect } from 'react';
import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { getPlayerControls } from '../navigation/layouts.js';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { PLAYER_DURATION_SECONDS } from '../navigation/navReducer.js';
import { useLastDefined, usePresence } from '../hooks/usePresence.js';
import { formatDuration } from '../utils/time.js';
import FocusIndicator from './FocusIndicator.jsx';
import Artwork from './Artwork.jsx';
import ProgressBar from './ProgressBar.jsx';
import Icon from './Icon.jsx';
import './PlayerOverlay.css';

const SCOPE = 'player';

/** Simulated full-screen playback (or app launch) opened by Enter on any content. */
export default function PlayerOverlay() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const open = Boolean(findOverlay(state, SCOPE));
  const playback = useLastDefined(state.playback);
  const { mounted, closing } = usePresence(open);
  const playing = open && Boolean(state.playback?.playing);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => dispatch({ type: 'PLAYER_TICK' }), 1000);
    return () => clearInterval(timer);
  }, [playing, dispatch]);

  if (!mounted || !playback) return null;

  const { media } = playback;
  const controls = getPlayerControls(playback);
  const isLive = media.kind === 'live';
  const isApp = media.kind === 'app';

  return (
    <div
      className={`player overlay-anim ${closing ? 'is-closing' : ''} ${playback.playing ? 'is-playing' : 'is-paused'}`}
      role="dialog"
      aria-label={media.title}
    >
      {isApp ? (
        <div className="player__app-bg" style={{ background: media.app.background }} />
      ) : (
        <Artwork item={media} showTitle={false} className="player__art" />
      )}
      <div className="player__scrim" />

      {isApp ? (
        <div className="player__app">
          <div
            className="player__app-icon"
            style={{ background: media.app.background, color: media.app.foreground }}
          >
            {media.app.label}
          </div>
          <h1 className="player__title">{media.title}</h1>
          <p className="player__subtitle">This app would launch here. It is not available in the browser simulation.</p>
        </div>
      ) : (
        <div className="player__top">
          <span className={`player__tag ${isLive ? 'is-live' : ''}`}>{isLive ? 'LIVE' : 'NOW PLAYING'}</span>
          <h1 className="player__title">{media.title}</h1>
          <p className="player__subtitle">{media.subtitle}</p>
        </div>
      )}

      {!isApp && !playback.playing && (
        <div className="player__paused" aria-hidden="true">
          <Icon name="pause" />
        </div>
      )}

      <div className="player__bottom">
        {!isApp && (
          <div className="player__timeline">
            <span>{formatDuration(playback.position * PLAYER_DURATION_SECONDS)}</span>
            <ProgressBar value={playback.position} />
            <span>{isLive ? 'LIVE' : formatDuration(PLAYER_DURATION_SECONDS)}</span>
          </div>
        )}
        <div className="player__controls">
          {controls.map((control, col) => (
            <FocusIndicator
              key={control.id}
              variant="fill"
              focused={isOverlayFocused(state, SCOPE, 0, col)}
              target={makeTarget(SCOPE, 0, col)}
              className="round-button"
            >
              <Icon name={control.icon} />
              <span className="round-button__label">{control.label}</span>
            </FocusIndicator>
          ))}
        </div>
      </div>
    </div>
  );
}
