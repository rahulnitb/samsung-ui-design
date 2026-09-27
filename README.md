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
- **Hero**: ←/→ change the promo slide (it also auto-rotates), Enter on the CTA opens it.
- **Rows** remember their last position. The Apps grid and on-screen keyboard move spatially (straight up/down).
- **Back** jumps to the tab pill, then to For You, then to the sidebar.
- **Search**: a universal search across everything on the TV — movies/shows, live channels and apps — grouped into result rows by type, the way Samsung's own Smart Hub search groups its results (keyboard/input on the left, a scrolling grouped-results grid on the right). Type with the physical keyboard, or use the on-screen keyboard; ↓ from the keyboard reaches the results, Enter opens the right kind of screen (player for a title/channel, an app-launch screen for an app). Esc closes.
- **Settings**: ↑/↓ choose a category, → or Enter to enter its options, Enter cycles a value, ← / Esc go back.
  *General → Hero Autoplay* and *Accessibility → High Contrast Focus / Reduce Motion* really change the UI.
- **Profile**: the avatar at the top of the sidebar opens a right-side panel with two tabs, **Friends List** and **Add Friends**. ↑/↓ pick a tab, → or Enter enters its list, Enter on a person removes them (Friends List) or adds them (Add Friends), ← / Esc go back. Friends are mock data (`profileData.js`); the list starts with 3 dummy friends out of 8 dummy contacts.
- **Bixby**: the pulsing mic icon at the start of the app row is a voice-search stand-in (there's no real microphone in a browser, so it's simulated). Enter/click it, wait ~2s through the "Listening…" screen, and its result appears as a floating popup hovering over whatever screen you were on (dimmed behind it, not replaced) — a single row of matches under a "🎤 Bixby heard …" banner, cycling through 6 dummy phrases on repeat use. One ("dragons") deliberately matches nothing, to also show the Suggested fallback; another ("Show me everything") deliberately matches a lot, to show the row scrolling well past 10 results. ↑ from the row reaches a Close button; Esc, Close, or clicking outside the popup all dismiss it — either way focus returns to the Bixby tile, not into Search.
- **QR code**: the QR icon in the sidebar (just above Settings) opens a card with a generated QR-style pattern over a genuinely blurred background (`backdrop-filter`, not just a dim) — the only overlay that blurs rather than dims. Enter/click it to open, Esc/Close/click-outside to dismiss. The code is decorative (deterministic per `data/qrData.js`'s `url`, not a real encoder), and the card says so.
- **Mouse** (like a TV pointer remote): hovering an item focuses it, clicking activates it, and the wheel steps focus up/down (Shift + wheel = left/right). Hovering the tab pill doesn't switch pages; click a tab instead. For a moment after any key press, hover is ignored so the remote always wins.

## Project structure

```
src/
  main.jsx, App.jsx
  data/            mock content (edit these to change what is shown)
    heroData.js movieData.js appData.js liveData.js settingsData.js sidebarData.js profileData.js
  navigation/      the focus engine (no UI)
    navReducer.js       single source of truth for focus + all key handling
    layouts.js          each screen described as rows of focusable items
    grid.js             generic row/column movement (spatial + remembered columns)
    selectors.js        "is this focused?" helpers used by components
    keyMap.js           keyboard/remote key → command
    useRemoteControl.js global key listener
    NavigationContext.jsx
  hooks/           focus-following scroll, overlay presence, clock
  components/      UI (each with its own CSS)
  styles/          tokens (sizes/colours/focus) + base styles
  utils/           search + time helpers
```

## Replacing mock content

- **Hero**: `heroData.js` holds each promo slide (title, tag, provider, CTA, colours); add `image: "/images/foo.jpg"` to a slide to replace the generated background with real key art.
- **Images**: set `image: "/images/foo.jpg"` on any title (`movieData.js`) and put the file in `public/images/`. Without `image`, artwork is generated from `palette`.
- **Rows**: edit `forYouSections` in `movieData.js` (Now Playing + Recommended share the first card row). Row order lives in `navigation/layouts.js`.
- **Apps**: edit `appData.js`. Add `icon: "/icons/netflix.png"` to show a real logo instead of the text label.
- **Live channels**: edit `liveData.js`.
- **Settings**: edit `settingsData.js`.
- **Search**: `utils/search.js`'s `searchAll(query)` decides what matches, grouped into `movies` / `channels` / `apps`; `navigation/layouts.js`'s `buildResultRows` turns that into result rows (a row only exists when it has a match). `popularTitles()` (the default empty-query list) shows the whole catalogue — every row scrolls by focus, so there's no need to trim it short.
- **Bixby**: edit `bixbyPhrases` in `data/bixbyData.js` — each entry is `{ said, query }`, the transcript shown and the text actually searched; `BIXBY_RESULT_LIMIT` caps how many items the result popup's single row can show (currently 24, well past what fits on screen at once — try "Show me everything" to see it scroll).
- **Profile / friends**: edit `profileData.js` — `profileContacts` is the full contact book, `initialFriendIds` picks which of them start out as friends.
- **QR code**: edit `qrData.js`'s `qrConfig` (`title`, `url`, `caption`). The pattern in `components/QRCode.jsx` is generated deterministically from `url` — decorative, not a real QR encoder.

## Extending navigation

Screens are declared as rows in `navigation/layouts.js`. A new row kind needs:
1. a row descriptor in `layouts.js`,
2. an Enter case in `activateMainItem` (`navReducer.js`),
3. a renderer in the page component (usually `ContentSection` with a `renderItem`).

Focus movement, scrolling, mouse support and the debug overlay work without further changes.
