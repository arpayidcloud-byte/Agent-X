import QualityView from '@/components/quality-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function QualityPage() {
  return (
    <main className="text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4">
          <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            Quality
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Score and track the quality of agent outputs.
          </p>
        </header>
        <QualityView />
      </div>
    </main>
  );
}
