import { useNavState } from '../navigation/NavigationContext.jsx';
import { isMainFocused, makeTarget } from '../navigation/selectors.js';
import { getPageRows } from '../navigation/layouts.js';
import TopNavigation from './TopNavigation.jsx';
import PageScroller from './PageScroller.jsx';
import ContentSection from './ContentSection.jsx';
import FocusIndicator from './FocusIndicator.jsx';
import AppIcon from './AppIcon.jsx';
import AppsHero from './AppsHero.jsx';
import EditorsChoiceCard from './EditorsChoiceCard.jsx';
import './AppsPage.css';

const rows = getPageRows('apps');

// Consecutive appGrid rows sharing a `section` (Installed Apps, More to Explore)
// render together under one heading.
function groupGridRows() {
  const groups = [];
  rows.forEach((row, index) => {
    if (row.kind !== 'appGrid') return;
    const last = groups[groups.length - 1];
    if (last?.section.id === row.section.id) last.rows.push({ row, index });
    else groups.push({ section: row.section, rows: [{ row, index }] });
  });
  return groups;
}

const gridGroups = groupGridRows();
const gridGroupByFirstIndex = new Map(gridGroups.map((group) => [group.rows[0].index, group]));
const skipGridIndex = new Set(gridGroups.flatMap((group) => group.rows.slice(1).map((entry) => entry.index)));

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

// appGrid rows are a plain grid rather than a scrolling ContentSection track, so
// their focus wiring is spelled out directly here (spatial columns via `widths`,
// same { area: 'main', row, col } targets as everywhere else on the page).
function AppGridGroup({ group }) {
  const state = useNavState();
  return (
    <section className="apps-section" data-row={group.rows[0].index}>
      <h2 className="apps-section__title">{group.section.title}</h2>
      {group.rows.map(({ row, index }) => (
        <div key={row.id} className="apps-grid__row" data-row={index === group.rows[0].index ? undefined : index}>
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
}

export default function AppsPage() {
  return (
    <PageScroller padded>
      {rows.map((row, index) => {
        switch (row.kind) {
          case 'banner':
            return <AppsHero key={row.id} rowIndex={index} />;
          case 'tabs':
            return <TopNavigation key={row.id} rowIndex={index} />;
          case 'apps':
            return (
              <ContentSection
                key={row.id}
                items={row.items}
                rowIndex={index}
                rowId={row.id}
                className="apps-featured"
                renderItem={(app, focus, col) => (
                  <AppIcon
                    app={app}
                    shape="squircle"
                    showName
                    groupLabel={row.groupLabels?.[col]}
                    className={col === row.groupStart ? 'app-icon--group-start' : ''}
                    {...focus}
                  />
                )}
              />
            );
          case 'editorsChoice':
            return (
              <ContentSection
                key={row.id}
                title={row.title}
                items={row.items}
                rowIndex={index}
                rowId={row.id}
                renderItem={(item, focus) => <EditorsChoiceCard item={item} {...focus} />}
              />
            );
          case 'appGrid':
            return skipGridIndex.has(index) ? null : <AppGridGroup key={row.id} group={gridGroupByFirstIndex.get(index)} />;
          case 'categories':
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
          default:
            return null;
        }
      })}
    </PageScroller>
  );
}
