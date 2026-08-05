import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const FIELD_BASE =
  'w-full rounded-xl border border-white/[0.06] bg-surface-2/60 px-3.5 text-sm text-slate-100 ' +
  'placeholder:text-slate-500 transition-all duration-150 ' +
  'focus:border-accent-500/40 focus:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent-500/15 ' +
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

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={`${FIELD_BASE} h-10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8 ${className}`}
        {...rest}
      >
        {children}
      </select>
    );
  },
);
