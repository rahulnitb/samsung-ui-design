// Live programmes repeat their slot length forever so the mock schedule never "ends".
export function currentSlot(channel, now) {
  const duration = channel.end - channel.start;
  const elapsed = (((now - channel.start) % duration) + duration) % duration;
  const start = now - elapsed;
  return { start, end: start + duration, progress: elapsed / duration };
}

export function formatClock(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDuration(totalSeconds) {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (value) => String(value).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}
