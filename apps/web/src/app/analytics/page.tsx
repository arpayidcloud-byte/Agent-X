import Link from 'next/link';
import AnalyticsView from '@/components/analytics-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-8 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Analytics
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            <Link href="/" className="text-cyan-300 hover:underline">
              ← Dashboard
            </Link>
          </p>
        </header>
        <AnalyticsView />
      </div>
    </main>
  );
}
