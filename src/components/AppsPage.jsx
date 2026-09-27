import { useNavState } from '../navigation/NavigationContext.jsx';
import { getPageRows, tabsRowIndex } from '../navigation/layouts.js';
import TopNavigation from './TopNavigation.jsx';
import { isMainFocused, makeTarget } from '../navigation/selectors.js';
import PageScroller from './PageScroller.jsx';
import ContentSection from './ContentSection.jsx';
import FocusIndicator from './FocusIndicator.jsx';
import AppIcon from './AppIcon.jsx';
import './AppsPage.css';

const rows = getPageRows('apps');

// Consecutive grid rows that share a section are rendered under one heading.
function groupRows() {
  const groups = [];
  rows.forEach((row, index) => {
    if (row.kind === 'tabs') return;
    const last = groups[groups.length - 1];
    if (row.section && last?.section?.id === row.section.id) last.rows.push({ row, index });
    else groups.push({ section: row.section ?? null, rows: [{ row, index }] });
  });
  return groups;
}

const groups = groupRows();

function CategoryCard({ category, focused, target }) {
  return (
    <FocusIndicator variant="none" focused={focused} target={target} className="category-card">
      <div className="category-card__surface focus-ring" style={{ background: category.background }}>
        <span className="category-card__name">{category.name}</span>
        <span className="category-card__count">{category.count} apps</span>
      </div>
    </FocusIndicator>
  );
}

export default function AppsPage() {
  const state = useNavState();

  return (
    <PageScroller padded>
      <TopNavigation rowIndex={tabsRowIndex('apps')} />
      {groups.map((group) => {
        if (!group.section) {
          const { row, index } = group.rows[0];
          return (
            <ContentSection
              key={row.id}
              className="apps-categories"
              title={row.title}
              items={row.items}
              rowIndex={index}
              rowId={row.id}
              renderItem={(category, focus) => <CategoryCard category={category} {...focus} />}
            />
          );
        }

        // The section element carries the first row's data-row so its heading scrolls into view with it.
        const [first, ...rest] = group.rows;
        return (
          <section key={group.section.id} className="apps-section" data-row={first.index}>
            <h2 className="apps-section__title">{group.section.title}</h2>
            {[first, ...rest].map(({ row, index }) => (
              <div key={row.id} className="apps-grid__row" data-row={index === first.index ? undefined : index}>
                {row.items.map((app, col) => (
                  <AppIcon
                    key={app.id}
                    app={app}
                    shape="tile"
                    showName
                    focused={isMainFocused(state, index, col)}
                    target={makeTarget('main', index, col)}
                  />
                ))}
              </div>
            ))}
          </section>
        );
      })}
    </PageScroller>
  );
}
