import { useEffect, useRef } from 'react';
import { createMockSocket } from '../api/mockSocket.js';

const PING_INTERVAL_MS = 30000;
const SHARE_SEND_DELAY_MS = 400;

/**
 * Owns the (dummy) companion-device websocket for the app's whole lifetime, independent of
 * whether the QR pairing card is currently on screen — it has to outlive that overlay closing
 * (see navReducer.js's QR_STATUS_UPDATE), both to keep the 30s ping alive and to keep listening
 * for incoming pushes (see WS_CONTENT_RECEIVED) at any point after pairing succeeds. Called once
 * from TvShell.jsx, same pattern as hooks/useFriendsSync.js.
 */
export function useQrSocket(state, dispatch) {
  const wsUrl = state.qr.wsUrl;
  const socketRef = useRef(null);
  const inFlightShares = useRef(new Set());

  useEffect(() => {
    if (!wsUrl) return undefined;
    const socket = createMockSocket(wsUrl);
    socketRef.current = socket;
    socket.onopen = () => dispatch({ type: 'QR_SOCKET_OPEN' });
    socket.onclose = () => dispatch({ type: 'QR_SOCKET_CLOSED' });
    socket.onmessage = (event) => {
      let message;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }
      if (message?.type === 'incoming_content') {
        dispatch({ type: 'WS_CONTENT_RECEIVED', id: message.id, items: message.items });
      }
    };
    const ping = setInterval(() => {
      socket.send(JSON.stringify({ type: 'ping' }));
      dispatch({ type: 'QR_SOCKET_PING', at: Date.now() });
    }, PING_INTERVAL_MS);
    return () => {
      clearInterval(ping);
      socket.close();
      socketRef.current = null;
    };
  }, [wsUrl, dispatch]);

  // Drains the reducer's `pendingShares` outbox — same shape as useFriendsSync.js's outbox —
  // sending each queued share over the live socket, then confirming once it "lands".
  useEffect(() => {
    state.pendingShares.forEach((entry) => {
      if (inFlightShares.current.has(entry.seq)) return;
      inFlightShares.current.add(entry.seq);
      socketRef.current?.send(JSON.stringify({ type: 'share', friendId: entry.friendId, itemIds: entry.itemIds }));
      setTimeout(() => {
        inFlightShares.current.delete(entry.seq);
        dispatch({ type: 'SHARE_SENT', seq: entry.seq });
      }, SHARE_SEND_DELAY_MS);
    });
  }, [state.pendingShares, dispatch]);
}
