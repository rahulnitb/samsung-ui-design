import FocusIndicator from './FocusIndicator.jsx';
import Icon from './Icon.jsx';
import './AppIcon.css';

/**
 * App tile. shape: "round" (launcher) | "squircle" (small Recommended/Samsung rows) | "tile" (apps grid).
 * `groupLabel` is an optional heading drawn above the icon (e.g. "Recommended"),
 * for a row shared by two labelled groups — see ContentCard's `label` for the same pattern.
 */
export default function AppIcon({ app, focused, target, shape = 'round', showName = false, groupLabel, className = '' }) {
  const longLabel = app.label.length > 3;

  return (
    <FocusIndicator
      variant="none"
      focused={focused}
      target={target}
      className={`app-icon app-icon--${shape} ${showName ? 'app-icon--named' : ''} ${className}`}
    >
      {groupLabel && <span className="app-icon__group-label">{groupLabel}</span>}
      <div
        className={`app-icon__badge focus-ring ${app.isVoiceAssistant ? 'app-icon__badge--voice' : ''}`}
        style={{ '--app-bg': app.background, '--app-fg': app.foreground }}
      >
        {app.isVoiceAssistant ? (
          <Icon name="mic" className="app-icon__voice-icon" />
        ) : app.glyphIcon ? (
          <Icon name={app.glyphIcon} className="app-icon__glyph" />
        ) : app.iconSvg ? (
          <svg
            className="app-icon__brand-svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            // Fixed, self-authored data (fetched once into data/appData.js), not user input.
            dangerouslySetInnerHTML={{ __html: app.iconSvg }}
          />
        ) : app.icon ? (
          <img src={app.icon} alt="" />
        ) : (
          <span className={`app-icon__label ${longLabel ? 'app-icon__label--long' : ''}`}>{app.label}</span>
        )}
      </div>
      <div className="app-icon__name">{app.name}</div>
    </FocusIndicator>
  );
}
