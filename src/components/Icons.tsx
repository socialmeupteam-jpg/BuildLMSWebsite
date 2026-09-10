interface IconProps {
  className?: string;
  size?: number;
}

const ico = (path: string, fill = false) =>
  ({ className = '', size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'} strokeWidth={1.75} strokeLinecap="round"
      strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={path} />
    </svg>
  );

const icoMulti = (paths: string[], fill = false) =>
  ({ className = '', size = 20 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'} strokeWidth={1.75} strokeLinecap="round"
      strokeLinejoin="round" className={className} aria-hidden="true">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );

export const IconDashboard = ({ className = '', size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const IconBook = ico('M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 014 17V5a2 2 0 012-2h14a2 2 0 012 2v10M4 19.5V21h16v-1.5M8 7h8M8 11h5');
export const IconClipboard = ico('M9 2h6a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1zM5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zM9 12h6M9 16h4');
export const IconCalendar = ico('M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z');
export const IconAward = ico('M12 15a6 6 0 100-12 6 6 0 000 12zM8.21 13.89L7 23l5-3 5 3-1.21-9.12');
export const IconCreditCard = ico('M1 10h22M1 6.5a2 2 0 012-2h18a2 2 0 012 2v11a2 2 0 01-2 2H3a2 2 0 01-2-2V6.5zM6 15h1M10 15h4');
export const IconMedal = ico('M12 2l2.09 6.26L20 9.27l-4.5 4.38 1.09 6.34L12 17l-4.59 2.99 1.09-6.34L4 9.27l5.91-.91L12 2z');
export const IconMail = ico('M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6');
export const IconBell = ico('M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0');
export const IconUsers = ico('M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75');
export const IconSettings = ico('M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z');
export const IconBarChart = ico('M18 20V10M12 20V4M6 20v-6');
export const IconChevronLeft = ico('M15 18l-6-6 6-6');
export const IconChevronRight = ico('M9 18l6-6-6-6');
export const IconChevronDown = ico('M6 9l6 6 6-6');
export const IconSearch = ico('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0');
export const IconPlus = ico('M12 5v14M5 12h14');
export const IconFilter = ico('M22 3H2l8 9.46V19l4 2v-8.54L22 3');
export const IconDownload = ico('M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3');
export const IconUpload = ico('M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12');
export const IconCheck = ico('M20 6L9 17l-5-5');
export const IconX = ico('M18 6L6 18M6 6l12 12');
export const IconAlertTriangle = ico('M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01');
export const IconInfo = ico('M12 22a10 10 0 100-20 10 10 0 000 20zM12 8h.01M11 12h1v4h1');
export const IconEye = ico('M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 100-6 3 3 0 000 6');
export const IconEdit = ico('M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z');
export const IconTrash = ico('M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6');
export const IconLogOut = ico('M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9');
export const IconUser = ico('M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8');
export const IconGraduate = ico('M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5');
export const IconClock = ico('M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2');
export const IconTrendingUp = ico('M23 6l-9.5 9.5-5-5L1 18M17 6h6v6');
export const IconTarget = ico('M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4');
export const IconPlay = ico('M5 3l14 9-14 9V3z', true);
export const IconFileText = ico('M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8');
export const IconStar = ico('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
export const IconMenu = ico('M3 12h18M3 6h18M3 18h18');
export const IconGrid = ico('M10 3H3v7h7V3zM21 3h-7v7h7V3zM21 14h-7v7h7v-7zM10 14H3v7h7v-7z');
export const IconList = ico('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01');
export const IconDollarSign = ico('M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6');
export const IconPercent = ico('M19 5L5 19M6.5 6.5a1 1 0 100-2 1 1 0 000 2zM17.5 19.5a1 1 0 100-2 1 1 0 000 2');
export const IconExternalLink = ico('M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3');
export const IconRefreshCw = ico('M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15');
export const IconShield = ico('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z');
export const IconMessageSquare = ico('M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z');
export const IconHelp = ico('M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01');
export const IconPaperclip = ico('M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48');
export const IconVideo = ico('M23 7l-7 5 7 5V7zM1 5h15a2 2 0 012 2v10a2 2 0 01-2 2H1a2 2 0 01-2-2V7a2 2 0 012-2z');
export const IconHome = ico('M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10');
export const IconActivity = ico('M22 12h-4l-3 9L9 3l-3 9H2');
export const IconCheckCircle = ico('M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3');
export const IconLink = ico('M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71');
export const IconLock = ico('M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4');
export const IconSend = ico('M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z');
