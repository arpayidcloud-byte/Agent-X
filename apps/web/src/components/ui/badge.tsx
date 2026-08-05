import type { HTMLAttributes } from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-surface-3/80 text-slate-400 border-white/[0.06]',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  danger: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  info: 'bg-sky-500/10 text-sky-300 border-sky-500/25',
  accent: 'bg-accent-500/10 text-accent-300 border-accent-500/25',
};

const TONE_DOT: Record<Tone, string> = {
  neutral: 'bg-slate-500',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  info: 'bg-sky-400',
  accent: 'bg-accent-400',
};

export function Badge({ tone = 'neutral', className = '', children, ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5 ${TONE_CLASSES[tone]} ${className}`}
      {...rest}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} aria-hidden />
      {children}
    </span>
  );
}
