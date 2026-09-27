import './ProgressBar.css';

export default function ProgressBar({ value, className = '' }) {
  const percent = Math.min(1, Math.max(0, value)) * 100;
  return (
    <div className={`progress ${className}`} role="progressbar" aria-valuenow={Math.round(percent)}>
      <div className="progress__fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
