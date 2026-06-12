'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

/* The Stub brand mark (Figma export, 2026-06-12 rev 2). */
export function ShiftMark({
  className,
  gradient = true,
}: {
  className?: string;
  gradient?: boolean;
}) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 43 40"
      fill={gradient ? `url(#${id})` : 'currentColor'}
      aria-hidden="true"
      className={cn('h-[26px] w-auto shrink-0', className)}
    >
      {gradient && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      )}
      <path d="M37.2 0H0C2.7 0.6 4.59999 3 4.59999 5.7V39.3C8.29999 35.6 10.3 30.7 10.3 25.5V6.7C10.3 6.2 10.7 5.7 11.3 5.7C11.8 5.7 12.3 6.1 12.3 6.7V31.7C16 28 18 23.1 18 17.9V6.7C18 6.2 18.4 5.7 19 5.7C19.5 5.7 20 6.1 20 6.7V24.1L25 19.1C25.2 18.9 25.3 18.7 25.4 18.5V18.4C25.6 18.1 25.6 17.8 25.7 17.4C26.2 10.9 31.6 5.7 38.3 5.7H43L37.2 0Z" />
    </svg>
  );
}

/** Mark + wordmark lockup used in headers and the sidebar. */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-white', className)}>
      <ShiftMark className={markClassName} />
      <span className="text-[17px] font-semibold tracking-tight leading-none">stub</span>
    </span>
  );
}

export default Logo;
