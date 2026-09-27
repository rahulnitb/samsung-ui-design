// Settings panel content. Each option cycles through `values` with Enter.
// Options marked "live" below actually change the UI (see TvShell / HeroCarousel).
export const settingsCategories = [
  {
    id: 'picture',
    label: 'Picture',
    description: 'Adjust picture mode, brightness and HDR.',
    options: [
      { id: 'pictureMode', label: 'Picture Mode', values: ['Standard', 'Movie', 'Dynamic', 'Filmmaker Mode'] },
      { id: 'brightness', label: 'Brightness', values: ['Medium', 'High', 'Low'] },
      { id: 'hdrPlus', label: 'HDR+ Mode', values: ['On', 'Off'] },
    ],
  },
  {
    id: 'sound',
    label: 'Sound',
    description: 'Sound mode, output device and volume behaviour.',
    options: [
      { id: 'soundMode', label: 'Sound Mode', values: ['Standard', 'Adaptive', 'Amplify'] },
      { id: 'soundOutput', label: 'Sound Output', values: ['TV Speaker', 'Bluetooth', 'HDMI eARC'] },
      { id: 'autoVolume', label: 'Auto Volume', values: ['Off', 'On'] },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    description: 'Network status and connection settings.',
    options: [
      { id: 'networkStatus', label: 'Network Status', values: ['Connected (Wi-Fi)'] },
      { id: 'wifiNetwork', label: 'Wi-Fi Network', values: ['Home-5G', 'Home-2.4G', 'Guest'] },
      { id: 'deviceName', label: 'Device Name', values: ['Living Room TV'] },
    ],
  },
  {
    id: 'general',
    label: 'General',
    description: 'Home screen, language and power.',
    options: [
      { id: 'heroAutoplay', label: 'Hero Autoplay', values: ['On', 'Off'] }, // live
      { id: 'language', label: 'Language', values: ['English', 'Hindi', 'Español', 'Français'] },
      { id: 'powerSaving', label: 'Power Saving', values: ['Off', 'On'] },
    ],
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    description: 'Make the screen easier to see and navigate.',
    options: [
      { id: 'highContrastFocus', label: 'High Contrast Focus', values: ['Off', 'On'] }, // live
      { id: 'reduceMotion', label: 'Reduce Motion', values: ['Off', 'On'] }, // live
      { id: 'voiceGuide', label: 'Voice Guide', values: ['Off', 'On'] },
    ],
  },
  {
    id: 'system',
    label: 'System',
    description: 'Software and device information.',
    options: [
      { id: 'softwareVersion', label: 'Software Version', values: ['0.1.0 (Browser Simulation)'] },
      { id: 'autoUpdate', label: 'Auto Update', values: ['On', 'Off'] },
      { id: 'about', label: 'About This TV', values: ['Web prototype, 1920×1080'] },
    ],
  },
];

export const settingsOptionsById = Object.fromEntries(
  settingsCategories.flatMap((category) => category.options.map((option) => [option.id, option])),
);

// Values are stored as indexes into each option's `values` array; index 0 is the default.
export function createDefaultSettings() {
  return Object.fromEntries(Object.keys(settingsOptionsById).map((id) => [id, 0]));
}
