import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const FIELD_BASE =
  'w-full rounded-lg border border-surface-3 bg-surface-1 px-3.5 text-sm text-slate-100 ' +
  'placeholder:text-slate-500 transition-colors duration-150 ' +
  'focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-500/20 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...rest }, ref) {
    return <input ref={ref} className={`${FIELD_BASE} h-10 ${className}`} {...rest} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = '', ...rest }, ref) {
  return (
    <textarea ref={ref} className={`${FIELD_BASE} py-2.5 leading-relaxed ${className}`} {...rest} />
  );
});
