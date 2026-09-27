import { getPageRows } from '../navigation/layouts.js';
import PageScroller from './PageScroller.jsx';
import HeroCarousel from './HeroCarousel.jsx';
import TopNavigation from './TopNavigation.jsx';
import ContentSection from './ContentSection.jsx';
import ContentCard from './ContentCard.jsx';
import AppLauncher from './AppLauncher.jsx';

const rows = getPageRows('forYou');

export default function ForYouPage() {
  return (
    <PageScroller>
      {rows.map((row, index) => {
        switch (row.kind) {
          case 'hero':
            return <HeroCarousel key={row.id} rowIndex={index} />;
          case 'tabs':
            return <TopNavigation key={row.id} rowIndex={index} className="top-nav--hero" />;
          case 'cards':
            return (
              <ContentSection
                key={row.id}
                className={row.labels ? 'content-section--labelled' : ''}
                title={row.title}
                items={row.items}
                rowIndex={index}
                rowId={row.id}
                renderItem={(item, focus, col) => (
                  <ContentCard item={item} variant={row.variant} label={row.labels?.[col]} {...focus} />
                )}
              />
            );
          case 'apps':
            return <AppLauncher key={row.id} row={row} rowIndex={index} />;
          default:
            return null;
        }
      })}
    </PageScroller>
  );
}
