import { useEffect } from 'react';
import { useNavState } from '../navigation/NavigationContext.jsx';
import { getSettingValue, hasOverlay } from '../navigation/selectors.js';
import Sidebar from './Sidebar.jsx';
import ForYouPage from './ForYouPage.jsx';
import LivePage from './LivePage.jsx';
import AppsPage from './AppsPage.jsx';
import SearchOverlay from './SearchOverlay.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import ProfileOverlay from './ProfileOverlay.jsx';
import QRCodeOverlay from './QRCodeOverlay.jsx';
import BixbyOverlay from './BixbyOverlay.jsx';
import BixbyResultPopup from './BixbyResultPopup.jsx';
import PlayerOverlay from './PlayerOverlay.jsx';
import Toast from './Toast.jsx';
import DebugOverlay from './DebugOverlay.jsx';
import './TvShell.css';

const PAGE_COMPONENTS = { forYou: ForYouPage, live: LivePage, apps: AppsPage };

/** Top-level screen composition: sidebar, current page, overlays. */
export default function TvShell() {
  const state = useNavState();
  const reduceMotion = getSettingValue(state, 'reduceMotion') === 'On';
  const highContrast = getSettingValue(state, 'highContrastFocus') === 'On';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('reduce-motion', reduceMotion);
    root.classList.toggle('focus-high', highContrast);
  }, [reduceMotion, highContrast]);

  const Page = PAGE_COMPONENTS[state.page];
  const sidebarOpen = state.area === 'sidebar' && !hasOverlay(state);

  return (
    <div className={`tv ${sidebarOpen ? 'tv--sidebar-open' : ''}`}>
      <main className="tv__main">
        <div className="tv__page" key={state.page}>
          <Page />
        </div>
      </main>
      <div className="tv__scrim" aria-hidden="true" />
      <Sidebar />
      <SearchOverlay />
      <SettingsPanel />
      <ProfileOverlay />
      <QRCodeOverlay />
      <BixbyOverlay />
      <BixbyResultPopup />
      <PlayerOverlay />
      <Toast />
      {state.debug && <DebugOverlay />}
    </div>
  );
}
