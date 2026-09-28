# TV Home UI (browser simulation)

A 10-foot, remote-first TV home screen in React + Vite, inspired by the Samsung One UI Tizen layout.
It is a browser simulation, not a Tizen app. All content is mock data with generated placeholder artwork.

## Run

```bash
npm install
npm run dev      # opens http://localhost:5173 (also exposed on your LAN for a real TV browser)
npm run build    # production build into dist/
```

For the full TV feel, press **F11** in the browser for fullscreen.

## Remote / keyboard controls

| Key | Action |
| --- | --- |
| ← ↑ → ↓ | Move focus |
| Enter / Space | Activate focused item |
| Esc / Backspace | Back / close overlay |
| Ctrl + Shift + D | Toggle navigation debug overlay |

Tizen (10009) and webOS (461) Back key codes are also mapped.

- **Home screen** (top to bottom): promo hero → For You / Live / Apps pill → Now Playing + Recommended cards → app row → Continue Watching → Popular Movies. Focus starts on the "For You" tab. ← on the first item of a row opens the sidebar.
- **Tab pill**: ←/→ switch For You / Live / Apps immediately; ↑ from the pill reaches the hero.
- **Hero**: ←/→ change the promo slide (it also auto-rotates), Enter on the CTA opens it. It now carries the same illustrated-shape decoration (leaves/ring, tinted per slide) as the Apps/Live banners, layered behind its movie-poster art and title.
- **Rows** remember their last position. The Apps grid and on-screen keyboard move spatially (straight up/down).
- **Apps page** matches Samsung's own Smart Hub Apps tab: an illustrated banner ("Explore your favourite content quickly and easily") above the tab pill, then a **Recommended** / **Provided by Samsung** row — one continuous row of small square icons split by a divider, so ←/→ crosses straight from one group into the other — then **Editor's Choice** promo banners, then the fuller Installed Apps / More to Explore / Categories browsing below. The banner itself has nothing to focus, so ↓ from the tab pill goes straight to Recommended and ↑ never lands on it.
- **Live page** gets the same illustrated-banner treatment ("Live TV, all in one place"), warm-tinted instead of Apps' blue, above the existing "On Now" schedule and channel rows. Same rule: nothing to focus on the banner itself.
- **Back** jumps to the tab pill, then to For You, then to the sidebar.
- **Search**: a universal search across everything on the TV — movies/shows, live channels and apps — grouped into result rows by type, the way Samsung's own Smart Hub search groups its results (keyboard/input on the left, a scrolling grouped-results grid on the right). Type with the physical keyboard, or use the on-screen keyboard; ↓ from the keyboard reaches the results, Enter opens the right kind of screen (player for a title/channel, an app-launch screen for an app). Esc closes.
- **Settings**: ↑/↓ choose a category, → or Enter to enter its options, Enter cycles a value, ← / Esc go back.
  *General → Hero Autoplay* and *Accessibility → High Contrast Focus / Reduce Motion* really change the UI.
- **Profile**: the avatar at the top of the sidebar opens a right-side panel with three tabs, **Friends List**, **Add Friends** and **Blocked**. ↑/↓ pick a tab, → or Enter enters its list. On Friends List, Enter opens a small **Remove Friend / Block Friend / Cancel** popup (↑/↓ + Enter to choose) instead of acting instantly; on Add Friends, Enter adds; on Blocked, Enter unblocks. ← / Esc go back. The list is loaded from the dummy friends API on first open (see below); it starts with 3 dummy friends out of 8 dummy contacts, matching `profileData.js`'s `initialFriendIds`.
- **Bixby**: the pulsing mic icon at the start of the app row is a voice-search stand-in (there's no real microphone in a browser, so it's simulated). Enter/click it, wait ~2s through the "Listening…" screen, and its result appears as a floating popup hovering over whatever screen you were on (dimmed behind it, not replaced) — a single row of matches under a "🎤 Bixby heard …" banner, cycling through 6 dummy phrases on repeat use. One ("dragons") deliberately matches nothing, to also show the Suggested fallback; another ("Show me everything") deliberately matches a lot, to show the row scrolling well past 10 results. ↑ from the row reaches a Close button; Esc, Close, or clicking outside the popup all dismiss it — either way focus returns to the Bixby tile, not into Search.
- **QR code**: the QR icon in the sidebar (just above Settings) opens a card with a generated QR-style pattern over a genuinely blurred background (`backdrop-filter`, not just a dim) — the only overlay that blurs rather than dims. Enter/click it to open, Esc/Close/click-outside to dismiss. Opening it requests a fresh code from the dummy QR API, then polls a status endpoint until it reports "connected" (no real phone ever scans it — the mock connects itself after a couple of polls). Once connected, the card **closes itself** and a "Device connected" toast shows instead — the underlying (dummy) WebSocket connection keeps running in the background from that point on regardless of what you're doing on screen, pinged every 30s to stay alive. The code pattern itself stays decorative (deterministic per its url, not a real encoder), and the card said so while it was open.
- **Incoming share popup**: once paired, the companion device can "push" content over that same websocket — a floating popup appears (same dimmed-background treatment as Bixby's result popup) showing a row of tiles, each with a checkbox. ↑/↓ move between the header controls and the tile row, ←/→ move along whichever row you're on, Enter on a tile toggles its checkbox. Enter on **Share** (shows a running count once you've selected something) opens a friend picker — Enter on a friend shares the selected items with just them and closes both popups, then a "Content shared with …" toast confirms once the (simulated) send completes. Since there's no real companion device, nothing pushes on its own: open the nav debug overlay (Ctrl+Shift+D) and click **Simulate incoming share** to trigger one for testing — it calls `api/pushApi.js`'s `getIncomingShare()` directly.

## Dummy external APIs

Everything network-shaped in this app is a self-contained mock in `src/api/` — Promises that
resolve/reject after a simulated delay, with the same shapes real endpoints would have, so they
can be swapped for real `fetch`/`WebSocket` calls later without touching the reducer or components:

- **`api/qrApi.js`**: `getQrCode({ duid, guid })` (device identity from `data/deviceData.js`) returns a `qrId`/`qrUrl`; `getQrStatus(qrId)` is polled every ~1.5s (see `QRCodeOverlay.jsx`) and reports `{ status: 'pending' }` for the first couple of calls, then `{ status: 'connected', wsUrl }`.
- **`api/mockSocket.js`**: `createMockSocket(url)` — a `MockSocket` class matching the native `WebSocket` surface (`readyState`, `send`/`close`, `onopen`/`onmessage`/`onclose`), so a real `WebSocket` can drop in later unchanged. It acks any `{ type: 'ping' }` sent to it with a `{ type: 'pong' }` message, same as a real keepalive.
- **`api/friendsApi.js`**: `getFriendList()`, `addFriend`/`deleteFriend`/`blockUser`/`unblockUser(contactId)`, backed by module-level mock "server" state so changes persist across calls within the session. Friend/block actions in the UI update local state instantly (remote-control-friendly), then sync to this API in the background via the reducer's `pendingSync` outbox (drained by `hooks/useFriendsSync.js`); mutations fail ~5% of the time on purpose, to exercise the resync-from-server + toast error path.
- **`api/pushApi.js`**: `getIncomingShare()` — a small random mix of movies/channels/apps, as if pushed from the paired companion device. Nothing calls this on its own (see "Incoming share popup" above); `hooks/useQrSocket.js` owns the actual websocket (created once `qr.wsUrl` is set, independent of whether the QR card is still open) and its own outbox-drain effect for `pendingShares` (sending each over the socket, then confirming via a `SHARE_SENT` dispatch), mirroring `useFriendsSync.js`'s pattern.
- **Mouse** (like a TV pointer remote): hovering an item focuses it, clicking activates it, and the wheel steps focus up/down (Shift + wheel = left/right). Hovering the tab pill doesn't switch pages; click a tab instead. For a moment after any key press, hover is ignored so the remote always wins.

## Project structure

```
src/
  main.jsx, App.jsx
  data/            mock content (edit these to change what is shown)
    heroData.js movieData.js appData.js liveData.js settingsData.js sidebarData.js profileData.js deviceData.js
  api/             dummy external APIs (simulated network delay, no real backend)
    qrApi.js mockSocket.js friendsApi.js pushApi.js
  navigation/      the focus engine (no UI)
    navReducer.js       single source of truth for focus + all key handling
    layouts.js          each screen described as rows of focusable items
    grid.js             generic row/column movement (spatial + remembered columns)
    selectors.js        "is this focused?" helpers used by components
    keyMap.js           keyboard/remote key → command
    useRemoteControl.js global key listener
    NavigationContext.jsx
  hooks/           focus-following scroll, overlay presence, clock, friends-API sync, qr websocket
  components/      UI (each with its own CSS)
  styles/          tokens (sizes/colours/focus) + base styles
  utils/           search + time + shared random/id helpers
```

## Replacing mock content

- **Images**: movies, shows, live channels, Editor's Choice banners and the hero slides all use real stock photography by default now, via `utils/stockImage.js` (`stockImage(seed, w, h)` — a deterministic, freely-licensed photo from Lorem Picsum, seeded by the item's own id so it's stable across reloads). These are **not** real posters/key art — actual movie/show/channel artwork is copyrighted, so this project only ever uses generated placeholders or publicly usable images. Pass `image: null` instead of `stockImage(...)` on any item to fall back to the generated `palette` gradient. To use a specific real image instead, set `image: "/images/foo.jpg"` and put the file in `public/images/`.
- **Rows**: edit `forYouSections` in `movieData.js` (Now Playing + Recommended share the first card row). Row order lives in `navigation/layouts.js`.
- **Apps**: edit `appData.js`. Real brand logos come from `data/brandIcons.js` (fetched once from the open-source Simple Icons project) via `withBrand(app(...), 'slug')` — see that file for which brands are available. Apps/features with no real logo to fetch (Samsung first-party features, generic apps) use `withGlyph(app(...), 'iconName')` instead, a fitting stroke icon from `components/Icon.jsx` (globe for Internet, a music note, gallery, heart, game controller, palette, graduation cap, gift, sparkle, etc.) rather than a plain text badge; anything without a real logo or a fitting glyph keeps the text-initial badge as a last resort. Add `icon: "/icons/netflix.png"` instead to use your own image file. `recommendedRow` / `samsungRow` are the Apps page's top icon row, `editorsChoice` is the promo banner row.
- **Live channels**: edit `liveData.js`.
- **Settings**: edit `settingsData.js`.
- **Search**: `utils/search.js`'s `searchAll(query)` decides what matches, grouped into `movies` / `channels` / `apps`; `navigation/layouts.js`'s `buildResultRows` turns that into result rows (a row only exists when it has a match). `popularTitles()` (the default empty-query list) shows the whole catalogue — every row scrolls by focus, so there's no need to trim it short.
- **Bixby**: edit `bixbyPhrases` in `data/bixbyData.js` — each entry is `{ said, query }`, the transcript shown and the text actually searched; `BIXBY_RESULT_LIMIT` caps how many items the result popup's single row can show (currently 24, well past what fits on screen at once — try "Show me everything" to see it scroll).
- **Profile / friends**: edit `profileData.js` — `profileContacts` is the full contact book, `initialFriendIds` seeds the dummy friends API's initial state (`api/friendsApi.js`), not the reducer directly — the actual list is loaded from that API when the Profile panel first opens.
- **QR code**: edit `qrData.js`'s `qrConfig` (`title`, `caption` — display copy only now) and `data/deviceData.js`'s `deviceInfo` (the mock `duid`/`guid` sent to `getQrCode`). The pattern in `components/QRCode.jsx` is generated deterministically from whatever `qrUrl` the dummy API hands back — decorative, not a real QR encoder.

## Extending navigation

Screens are declared as rows in `navigation/layouts.js`. A new row kind needs:
1. a row descriptor in `layouts.js`,
2. an Enter case in `activateMainItem` (`navReducer.js`),
3. a renderer in the page component (usually `ContentSection` with a `renderItem`).

Focus movement, scrolling, mouse support and the debug overlay work without further changes.
