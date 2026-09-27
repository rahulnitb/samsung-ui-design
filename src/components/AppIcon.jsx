import FocusIndicator from './FocusIndicator.jsx';
import Icon from './Icon.jsx';
import './AppIcon.css';

/** App tile. shape: "round" (launcher) | "tile" (apps grid). */
export default function AppIcon({ app, focused, target, shape = 'round', showName = false }) {
  const longLabel = app.label.length > 3;

  return (
    <FocusIndicator
      variant="none"
      focused={focused}
      target={target}
      className={`app-icon app-icon--${shape} ${showName ? 'app-icon--named' : ''}`}
    >
      <div
        className={`app-icon__badge focus-ring ${app.isVoiceAssistant ? 'app-icon__badge--voice' : ''}`}
        style={{ '--app-bg': app.background, '--app-fg': app.foreground }}
      >
        {app.isVoiceAssistant ? (
          <Icon name="mic" className="app-icon__voice-icon" />
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
