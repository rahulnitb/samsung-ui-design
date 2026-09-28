import { useEffect } from 'react';
import { useNavDispatch, useNavState } from '../navigation/NavigationContext.jsx';
import { findOverlay, isOverlayFocused, makeTarget } from '../navigation/selectors.js';
import { usePresence } from '../hooks/usePresence.js';
import { qrConfig } from '../data/qrData.js';
import { deviceInfo } from '../data/deviceData.js';
import * as qrApi from '../api/qrApi.js';
import FocusIndicator from './FocusIndicator.jsx';
import QRCode from './QRCode.jsx';
import Icon from './Icon.jsx';
import './QRCodeOverlay.css';

const SCOPE = 'qr';
const POLL_INTERVAL_MS = 1500;

/** Opened from the sidebar's QR icon. Unlike the other overlays, the background is
 * genuinely blurred (not just dimmed) behind the card.
 *
 * Lifecycle, driven by the dummy api/qrApi.js:
 *  1. On open: request a QR code (params: device duid/guid).
 *  2. Once it's on screen: poll for connection status until it reports "connected" — at
 *     which point the reducer closes this overlay itself and shows a toast.
 * The websocket + 30s ping (api/mockSocket.js) is NOT owned here — it has to outlive this
 * overlay closing, so it lives in the always-mounted hooks/useQrSocket.js instead (see there).
 */
export default function QRCodeOverlay() {
  const state = useNavState();
  const dispatch = useNavDispatch();
  const open = Boolean(findOverlay(state, SCOPE));
  const { mounted, closing } = usePresence(open);
  const { status, qrId, qrUrl } = state.qr;

  useEffect(() => {
    if (!open) return undefined;
    let ignore = false;
    dispatch({ type: 'QR_REQUEST_START' });
    qrApi
      .getQrCode(deviceInfo)
      .then((result) => {
        if (!ignore) dispatch({ type: 'QR_REQUEST_SUCCESS', qrId: result.qrId, qrUrl: result.qrUrl });
      })
      .catch(() => {
        if (!ignore) dispatch({ type: 'QR_REQUEST_ERROR' });
      });
    return () => {
      ignore = true;
    };
  }, [open, dispatch]);

  useEffect(() => {
    if (!open || !qrId || status === 'connected') return undefined;
    const timer = setInterval(() => {
      qrApi.getQrStatus(qrId).then((result) => dispatch({ type: 'QR_STATUS_UPDATE', ...result }));
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [open, qrId, status, dispatch]);

  if (!mounted) return null;

  const connected = status === 'connected';
  const caption = connected
    ? 'Your companion app is paired with this TV.'
    : status === 'requesting'
      ? 'Generating your code…'
      : qrConfig.caption;

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

        {connected ? (
          <div className="qr-card__connected">
            <Icon name="wifi" className="qr-card__connected-icon" />
            <p className="qr-card__connected-label">Connected</p>
          </div>
        ) : (
          <div className="qr-card__code">
            {qrUrl ? <QRCode value={qrUrl} /> : <div className="qr-card__code-loading" aria-hidden="true" />}
          </div>
        )}

        <h2 className="qr-card__title">{qrConfig.title}</h2>
        <p className="qr-card__caption">{caption}</p>
        <p className="qr-card__note">Prototype code for this browser simulation — not scannable.</p>
      </div>
    </div>
  );
}
