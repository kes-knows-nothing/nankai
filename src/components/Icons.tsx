/** 앱에서 쓰는 아이콘 모음. 외부 아이콘 패키지 없이 인라인 SVG로 둔다. */

type Props = { size?: number };

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const SearchIcon = ({ size = 22 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const BackIcon = ({ size = 22 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} aria-hidden="true">
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const ChevronIcon = ({ size = 19 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#B0B8C1" strokeWidth={2} aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const PlayIcon = ({ size = 14 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const BranchIcon = ({ size = 21 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M13 5H5v14h14v-8" />
    <path d="m10 14 9-9" />
    <path d="M15 4h5v5" />
  </svg>
);

export const HomeIcon = ({ size = 24 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M4 11 12 4l8 7" />
    <path d="M6 10v9h12v-9" />
  </svg>
);

export const StudyIcon = ({ size = 24 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
    <path d="M13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13" />
  </svg>
);

export const ReviewIcon = ({ size = 24 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M4 12a8 8 0 1 1 2.3 5.6M4 20v-4h4" />
  </svg>
);

export const MeIcon = ({ size = 24 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);
