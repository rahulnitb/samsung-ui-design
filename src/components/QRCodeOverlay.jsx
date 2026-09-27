import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { usePresence } from '../hooks/usePresence.js';
import { qrConfig } from '../data/qrData.js';
import FocusIndicator from './FocusIndicator.jsx';
import QRCode from './QRCode.jsx';
import Icon from './Icon.jsx';
import './QRCodeOverlay.css';

const SCOPE = 'qr';

/** Opened from the sidebar's QR icon. Unlike the other overlays, the background is
 * genuinely blurred (not just dimmed) behind the card. */
export default function QRCodeOverlay() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const { mounted, closing } = usePresence(Boolean(findOverlay(state, SCOPE)));
  if (!mounted) return null;

  return (
    <div
      className={`qr-scrim ${closing ? 'is-closing' : ''}`}
      role="dialog"
      aria-label="QR code"
      onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })}
    >
      <div className={`qr-card ${closing ? 'is-closing' : ''}`} onClick={(event) => event.stopPropagation()}>
        <FocusIndicator
          variant="fill"
          focused={isOverlayFocused(state, SCOPE, 0, 0)}
          target={makeTarget(SCOPE, 0, 0)}
          className="qr-card__close"
        >
          <Icon name="close" />
        </FocusIndicator>

        <div className="qr-card__code">
          <QRCode value={qrConfig.url} />
        </div>
        <h2 className="qr-card__title">{qrConfig.title}</h2>
        <p className="qr-card__caption">{qrConfig.caption}</p>
        <p className="qr-card__note">Prototype code for this browser simulation — not scannable.</p>
      </div>
    </div>
  );
}
