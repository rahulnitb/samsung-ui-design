import FocusIndicator from './FocusIndicator.jsx';
import Artwork from './Artwork.jsx';
import ProgressBar from './ProgressBar.jsx';
import { currentSlot, formatClock } from '../utils/time.js';
import './ChannelCard.css';

export default function ChannelCard({ channel, now, focused, target }) {
  const slot = currentSlot(channel, now);

  return (
    <FocusIndicator variant="none" focused={focused} target={target} className="channel-card">
      <div className="channel-card__surface focus-ring">
        <div className="channel-card__art">
          <Artwork item={channel} showTitle={false} />
          <div className="channel-card__logo">{channel.short}</div>
          <span className="channel-card__live">LIVE</span>
        </div>
        <div className="channel-card__body">
          <div className="channel-card__channel">
            {channel.number} · {channel.name}
          </div>
          <div className="channel-card__program">{channel.program}</div>
          <ProgressBar value={slot.progress} />
          <div className="channel-card__time">
            <span>{formatClock(slot.start)}</span>
            <span>{formatClock(slot.end)}</span>
          </div>
        </div>
      </div>
    </FocusIndicator>
  );
}
