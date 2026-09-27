// Dummy "voice results" for the Bixby demo. `said` is the transcript shown as what
// Bixby heard; `query` is what actually gets searched. Most map to something real in
// the mock catalogue; the last one deliberately matches nothing, to also show the
// "Suggested" fallback results when Bixby mishears something.
export const bixbyPhrases = [
  { said: 'Play Inception', query: 'inception' },
  { said: 'Show me action movies', query: 'action' },
  { said: 'Open Netflix', query: 'netflix' },
  { said: 'Any news channels?', query: 'news' },
  { said: 'Play something with dragons', query: 'dragons' },
  { said: 'Show me everything', query: 'e' }, // broad on purpose — demonstrates the row scrolling past 10 results
];

export const BIXBY_LISTEN_MS = 1800;
// The result popup is still a single row, but no longer capped to a short handful —
// it scrolls (by focus, like every other row) rather than needing to be trimmed to fit.
export const BIXBY_RESULT_LIMIT = 24;
