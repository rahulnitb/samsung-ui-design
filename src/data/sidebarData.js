// Left navigation rail, top to bottom (Home sits at the bottom of the main group, as on the TV).
// `action` describes what Enter does; the navigation reducer interprets it.
// The "profile" item is rendered as the user's avatar (see Sidebar.jsx) instead of a stroke icon.
export const sidebarItems = [
  { id: 'profile', label: 'Profile', action: { type: 'overlay', overlay: 'profile' } },
  { id: 'search', label: 'Search', icon: 'search', action: { type: 'overlay', overlay: 'search' } },
  { id: 'liveTv', label: 'Live TV', icon: 'tv', action: { type: 'page', page: 'live' } },
  {
    id: 'smartThings',
    label: 'SmartThings',
    icon: 'smartthings',
    action: { type: 'toast', message: 'SmartThings: no devices connected' },
  },
  {
    id: 'media',
    label: 'Media',
    icon: 'media',
    action: { type: 'toast', message: 'Media library is not available in this simulation' },
  },
  { id: 'apps', label: 'Apps', icon: 'apps', action: { type: 'page', page: 'apps' } },
  { id: 'home', label: 'Home', icon: 'home', action: { type: 'page', page: 'forYou' } },
  {
    id: 'qr',
    label: 'QR Code',
    icon: 'qr',
    action: { type: 'overlay', overlay: 'qr' },
    pinBottom: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'gear',
    action: { type: 'overlay', overlay: 'settings' },
    pinBottom: true,
  },
];

// Which sidebar entry is highlighted as "active" for each page.
export const PAGE_TO_SIDEBAR = { forYou: 'home', live: 'liveTv', apps: 'apps' };
