type IconProps = React.SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const icons = {
  discover: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </Svg>
  ),
  translate: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 5h8M8 3v2m3 0c-1 4-3.5 7-7 9m1.5-5c1.2 2.6 3.3 4.6 6 5.6" />
      <path d="m12.5 21 4.5-9 4.5 9m-7.5-3h6" />
    </Svg>
  ),
  research: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M8 7h7M8 11h7M8 15h4" />
    </Svg>
  ),
  translation: (p: IconProps) => (
    <Svg {...p}>
      <path d="M7 8h7M10.5 6v2m2 0c-.8 3-2.7 5.3-5.5 7" />
      <path d="M9 15c.9-1 1.7-2.1 2.3-3.3M13 18l3-6 3 6m-5-2h4" />
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
    </Svg>
  ),
  greek: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 4h14M6.5 4v13a3 3 0 0 0 3 3M17.5 4v13a3 3 0 0 1-3 3" />
      <path d="M12 8v12" />
    </Svg>
  ),
  crossref: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 7h12m0 0-3-3m3 3-3 3M20 17H8m0 0 3-3m-3 3 3 3" />
    </Svg>
  ),
  context: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M3 10l9-6 9 6z" />
    </Svg>
  ),
  search: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  ),
  citation: (p: IconProps) => (
    <Svg {...p}>
      <path d="M9.5 8C7 8.5 5.5 10.5 5.5 13.5V16h4v-4h-2c0-1.6.9-2.7 2-3.2zM18.5 8c-2.5.5-4 2.5-4 5.5V16h4v-4h-2c0-1.6.9-2.7 2-3.2z" />
    </Svg>
  ),
  library: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.5l4 .8-3 15.2-4-.8z" />
    </Svg>
  ),
  workspace: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M10 9v12" />
    </Svg>
  ),
  notes: (p: IconProps) => (
    <Svg {...p}>
      <path d="m16 3 5 5-11 11H5v-5z" />
      <path d="m13.5 5.5 5 5" />
    </Svg>
  ),
  export: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5" />
      <path d="M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    </Svg>
  ),
  collections: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Svg>
  ),
  reading: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 6c-1.8-1.6-4.2-2.3-7-2v14c2.8-.3 5.2.4 7 2 1.8-1.6 4.2-2.3 7-2V4c-2.8-.3-5.2.4-7 2Z" />
      <path d="M12 6v14" />
    </Svg>
  ),
  check: (p: IconProps) => (
    <Svg {...p}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Svg>
  ),
  chevron: (p: IconProps) => (
    <Svg {...p}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  ),
  arrow: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 12h16m0 0-6-6m6 6-6 6" />
    </Svg>
  ),
  menu: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  ),
  close: (p: IconProps) => (
    <Svg {...p}>
      <path d="m5 5 14 14M19 5 5 19" />
    </Svg>
  ),
  globe: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.4 3.8 5.5 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.5-3.8-9s1.3-6.6 3.8-9Z" />
    </Svg>
  ),
  heart: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 20.5 4.7 13a4.8 4.8 0 0 1 0-6.8 4.6 4.6 0 0 1 6.6 0l.7.7.7-.7a4.6 4.6 0 0 1 6.6 0 4.8 4.8 0 0 1 0 6.8z" />
    </Svg>
  ),
  mail: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </Svg>
  ),
  analyze: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 19h16M6 19V9m4 10V5m4 14v-6m4 6V8" />
      <circle cx="18" cy="8" r="1.4" />
      <circle cx="14" cy="13" r="1.4" />
    </Svg>
  ),
  shield: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  ),
  lock: (p: IconProps) => (
    <Svg {...p}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <path d="M12 15v2" />
    </Svg>
  ),
  users: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.6M17 20a5.5 5.5 0 0 0-3-4.9" />
    </Svg>
  ),
  scan: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M4 12h16" />
    </Svg>
  ),
} as const;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Cmp = icons[name];
  return <Cmp className={className} />;
}
