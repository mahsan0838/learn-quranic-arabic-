import { useId } from 'react';

// Eight-pointed star (khatam) used as the brand mark and as a divider ornament.
export function starPoints(cx: number, cy: number, outer: number, inner: number, rotation = -Math.PI / 2) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rotation + (i * Math.PI) / 8;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

export function StarMark({ size = 40 }: { size?: number }) {
  const gid = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--gold-hi)" />
          <stop offset="1" stopColor="var(--gold-lo)" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="var(--gold)" strokeOpacity=".4" />
      <polygon points={starPoints(24, 24, 17, 13)} fill={`url(#${gid})`} />
      <polygon points={starPoints(24, 24, 11, 8.5, -Math.PI / 2 + Math.PI / 8)} fill="var(--bg)" />
      <circle cx="24" cy="24" r="3.4" fill={`url(#${gid})`} />
    </svg>
  );
}

export function Ornament({ label }: { label?: string }) {
  return (
    <div className="orn" role="presentation">
      <span className="orn-line" />
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <polygon points={starPoints(24, 24, 22, 17)} fill="var(--gold)" />
      </svg>
      {label && <span className="orn-label">{label}</span>}
      {label && (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <polygon points={starPoints(24, 24, 22, 17)} fill="var(--gold)" />
        </svg>
      )}
      <span className="orn-line" />
    </div>
  );
}
