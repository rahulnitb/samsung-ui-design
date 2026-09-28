import { Fragment } from 'react';
import { getPageRows } from '../navigation/layouts.js';
import { useNow } from '../hooks/useNow.js';
import PageScroller from './PageScroller.jsx';
import TopNavigation from './TopNavigation.jsx';
import ContentSection from './ContentSection.jsx';
import ChannelCard from './ChannelCard.jsx';
import LiveHero from './LiveHero.jsx';

const rows = getPageRows('live');

export default function LivePage() {
  const now = useNow(30000);
  const today = new Date(now).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <PageScroller padded>
      {rows.map((row, index) => {
        switch (row.kind) {
          case 'banner':
            return <LiveHero key={row.id} rowIndex={index} />;
          case 'tabs':
            return (
              <Fragment key={row.id}>
                <TopNavigation rowIndex={index} />
                <div className="page-intro">
                  <h1 className="page-intro__title">On Now</h1>
                  <p className="page-intro__subtitle">{today} · Samsung TV Plus and broadcast channels</p>
                </div>
              </Fragment>
            );
          case 'channels':
            return (
              <ContentSection
                key={row.id}
                title={row.title}
                items={row.items}
                rowIndex={index}
                rowId={row.id}
                renderItem={(channel, focus) => <ChannelCard channel={channel} now={now} {...focus} />}
              />
            );
          default:
            return null;
        }
      })}
    </PageScroller>
  );
}
