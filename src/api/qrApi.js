import { randomId } from '../utils/random.js';

// Dummy QR pairing API — stands in for a real backend. Every export returns a Promise
// that resolves after a simulated network delay, so call sites already look like real
// fetch calls and can be swapped for real ones later without touching the reducer or
// components.

const REQUEST_DELAY_MS = 500;
const STATUS_DELAY_MS = 600;
const POLLS_BEFORE_CONNECTED = 3; // ~2 "pending" polls, then "connected" — see getQrStatus

const pollCounts = new Map(); // qrId -> number of getQrStatus calls so far

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** POST /qr/code — request a fresh QR code for this device. */
export async function getQrCode({ duid, guid }) {
  await wait(REQUEST_DELAY_MS);
  const qrId = randomId('qr');
  pollCounts.set(qrId, 0);
  return {
    qrId,
    qrUrl: `tizen-tv://pair/${qrId}?duid=${duid}&guid=${guid}`,
    expiresInSec: 120,
  };
}

/**
 * GET /qr/status/:qrId — poll for connection status. No real phone will ever scan this
 * (the code is decorative, see QRCode.jsx), so this mock "connects itself" automatically
 * after a couple of pending polls, to demonstrate the full pending -> connected -> socket
 * flow without a second device.
 */
export async function getQrStatus(qrId) {
  await wait(STATUS_DELAY_MS);
  const count = (pollCounts.get(qrId) ?? 0) + 1;
  pollCounts.set(qrId, count);
  if (count < POLLS_BEFORE_CONNECTED) return { status: 'pending' };
  return { status: 'connected', wsUrl: `mock-ws://tv-companion.local/socket/${qrId}` };
}
