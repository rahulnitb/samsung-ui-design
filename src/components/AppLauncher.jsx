import ContentSection from './ContentSection.jsx';
import AppIcon from './AppIcon.jsx';
import './AppLauncher.css';

/** Row of rounded-square app icons under the featured cards on the home screen. */
export default function AppLauncher({ row, rowIndex }) {
  return (
    <ContentSection
      className="app-launcher"
      title={row.title}
      items={row.items}
      rowIndex={rowIndex}
      rowId={row.id}
      renderItem={(app, focus) => <AppIcon app={app} shape="round" {...focus} />}
    />
  );
}
