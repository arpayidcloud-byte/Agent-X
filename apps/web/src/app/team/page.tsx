import TeamView from '@/components/team-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TeamPage() {
  return (
    <main className="text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-4">
          <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            Team
          </h1>
        </header>
        <TeamView />
      </div>
    </main>
  );
}
