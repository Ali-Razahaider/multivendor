import { useId } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type MarkProps = { className?: string; title?: string };

// The Bazaarly mark: a lowercase "b" drawn as a price tag; the tag hole is the
// letter's counter.
export const LogoMark = ({ className, title }: MarkProps) => {
  const id = useId();
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn('h-9 w-9 shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill={`url(#${id}-bg)`} />
      <path
        fill="#fff"
        d="M14.5 10.5a2.75 2.75 0 0 1 5.5 0V19h7.6a3.2 3.2 0 0 1 2.35 1.03l6.3 6.8a3.2 3.2 0 0 1 0 4.34l-6.3 6.8A3.2 3.2 0 0 1 27.6 39H17.7a3.2 3.2 0 0 1-3.2-3.2Z"
      />
      <circle cx="27.6" cy="29" r="3.3" fill="#F59E0B" />
    </svg>
  );
};

type LogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  /** Light text for dark backgrounds. */
  inverted?: boolean;
  to?: string | null;
  subtitle?: string;
};

export const Logo = ({ className, markClassName, textClassName, inverted, to = '/', subtitle }: LogoProps) => {
  const content = (
    <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <LogoMark className={markClassName} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-[family-name:var(--font-heading)] text-[1.6rem] font-extrabold tracking-[-0.045em]',
            inverted ? 'text-white' : 'text-slate-900',
            textClassName
          )}
        >
          bazaarly
        </span>
        {subtitle && (
          <span className={cn('mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]', inverted ? 'text-brand-200' : 'text-brand-600')}>
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );

  if (!to) return content;
  return (
    <Link to={to} aria-label="Bazaarly home" className="rounded-xl">
      {content}
    </Link>
  );
};

export default Logo;
