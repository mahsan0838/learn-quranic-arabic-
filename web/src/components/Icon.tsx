import type { SVGProps } from 'react';

const paths = {
  today: 'M12 3v2M12 19v2M4.2 12H2.5M21.5 12H19.8M6.3 6.3 5.1 5.1M18.9 18.9l-1.2-1.2M6.3 17.7l-1.2 1.2M18.9 5.1l-1.2 1.2M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z',
  study: 'M5 7.5 12 4l7 3.5-7 3.5-7-3.5ZM5 12l7 3.5 7-3.5M5 16.5 12 20l7-3.5',
  library: 'M5 4.5h5.2c.9 0 1.8.4 1.8 1.5v13.5c0-1-.8-1.5-1.8-1.5H5V4.5ZM19 4.5h-5.2c-.9 0-1.8.4-1.8 1.5v13.5c0-1 .8-1.5 1.8-1.5H19V4.5Z',
  practice: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  progress: 'M4 19V11M10 19V5M16 19v-6M22 19H2M20 19V9',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 13.5a7.7 7.7 0 0 0 0-3l1.9-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5a7.6 7.6 0 0 0-2.6 1.5l-2.3-.9-2 3.4 1.9 1.5a7.7 7.7 0 0 0 0 3l-1.9 1.5 2 3.4 2.3-.9a7.6 7.6 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 2.6-1.5l2.3.9 2-3.4-1.9-1.5Z',
  flame: 'M12 21c3.9 0 6.5-2.6 6.5-6.2 0-2.7-1.6-4.6-3-6.1-.6-.7-1.2-1.5-1.4-2.7-2.1 1.2-3.3 3-3.7 5-.7-.5-1.1-1.3-1.2-2.2C7.4 10.6 5.5 12.6 5.5 15c0 3.5 2.6 6 6.5 6Z',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  close: 'M6 6l12 12M18 6 6 18',
  download: 'M12 4v11M7.5 11 12 15.5 16.5 11M5 20h14',
  share: 'M12 15V3.5M8 7.5l4-4 4 4M6 11H5.5A1.5 1.5 0 0 0 4 12.5v6A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H18',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4',
  chevron: 'm9 6 6 6-6 6',
  back: 'm15 6-6 6 6 6',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z',
  verbs: 'M4 7h16M4 12h10M4 17h16M18 10l3 2-3 2',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6',
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 22, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
