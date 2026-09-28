// A dummy WebSocket — there's no real server behind the wsUrl the QR flow "receives",
// so this stands in for `new WebSocket(url)` with the same public surface (readyState,
// the CONNECTING/OPEN/CLOSING/CLOSED constants, send/close, onopen/onmessage/onclose/
// onerror), so a real WebSocket could later be dropped in at the call site unchanged.
const OPEN_DELAY_MS = 200;
const PONG_DELAY_MS = 150;

export class MockSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url) {
    this.url = url;
    this.readyState = MockSocket.CONNECTING;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;

    this._openTimer = setTimeout(() => {
      if (this.readyState !== MockSocket.CONNECTING) return;
      this.readyState = MockSocket.OPEN;
      this.onopen?.({ type: 'open' });
    }, OPEN_DELAY_MS);
  }

  send(data) {
    if (this.readyState !== MockSocket.OPEN) return;
    let message;
    try {
      message = JSON.parse(data);
    } catch {
      return;
    }
    // Simulate a real server's keepalive ack for any ping we're sent.
    if (message?.type === 'ping') {
      const pongTimer = setTimeout(() => {
        if (this.readyState !== MockSocket.OPEN) return;
        this.onmessage?.({ data: JSON.stringify({ type: 'pong', ts: Date.now() }) });
      }, PONG_DELAY_MS);
      this._pongTimer = pongTimer;
    }
  }

  close() {
    clearTimeout(this._openTimer);
    clearTimeout(this._pongTimer);
    if (this.readyState === MockSocket.CLOSED) return;
    this.readyState = MockSocket.CLOSED;
    this.onclose?.({ type: 'close' });
  }
}

export function createMockSocket(url) {
  return new MockSocket(url);
}
