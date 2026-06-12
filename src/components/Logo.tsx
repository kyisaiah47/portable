import { cn } from '@/lib/utils';

/**
 * "Shift" — the Stub brand mark.
 * Four short parallel diagonal stripes stacked like the rows of a paystub,
 * forming a slanted parallelogram. Renders in currentColor so it inherits
 * the surrounding text color.
 */
export function ShiftMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M6.2 8.4 17.8 4.4" />
      <path d="M6.2 12.2 17.8 8.2" />
      <path d="M6.2 16 17.8 12" />
      <path d="M6.2 19.8 17.8 15.8" />
    </svg>
  );
}

/** Mark + wordmark lockup used in headers and the sidebar. */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-gray-900', className)}>
      <ShiftMark className={cn('text-indigo-600', markClassName)} />
      <span className="text-[17px] font-semibold tracking-tight leading-none">stub</span>
    </span>
  );
}

export default Logo;
