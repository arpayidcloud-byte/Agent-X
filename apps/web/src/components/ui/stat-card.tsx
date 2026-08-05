import type { LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = 'text-slate-100',
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  tone?: string;
}) {
  return (
    <div className="stat-card card-hover group rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-slate-500 transition-colors group-hover:text-accent-300 group-hover:bg-accent-500/10">
            <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          </span>
        )}
      </div>
      <p className={`mt-3 text-2xl font-bold tracking-tight ${tone}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
}
