import { fetchWaitlistStats, fetchFeedback, API_URL } from '../../lib/api';
import BetaSignupForm from '../../components/beta-signup-form';
import BetaFeedbackForm from '../../components/beta-feedback-form';

export const dynamic = 'force-dynamic';

export default async function BetaPage() {
  let stats: Awaited<ReturnType<typeof fetchWaitlistStats>> | null = null;
  let feedback: {
    entries: {
      id: string;
      category: string;
      message: string;
      rating?: number;
      email?: string;
      createdAt: string;
    }[];
    total: number;
  } | null = null;
  let apiOk = true;

  try {
    [stats, feedback] = await Promise.all([fetchWaitlistStats(), fetchFeedback(20)]);
  } catch {
    apiOk = false;
  }

  const total = stats?.total ?? 0;
  const bySource = stats?.bySource ?? {};

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-950 text-slate-100">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Beta Recruitment</h1>
        <p className="text-slate-400 mb-6">Phase 3 Week 19-20 — waitlist &amp; feedback system</p>

        {!apiOk && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 mb-6 text-sm">
            ⚠️ API tidak dapat dijangkau (<code className="text-red-300">{API_URL}</code>). Data di
            bawah tidak tersedia.
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Waitlist Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-xs text-slate-400">Total signups</div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <div className="text-2xl font-bold">{stats?.byStatus.pending ?? 0}</div>
              <div className="text-xs text-slate-400">Pending</div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <div className="text-2xl font-bold">{stats?.byStatus.invited ?? 0}</div>
              <div className="text-xs text-slate-400">Invited</div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <div className="text-2xl font-bold">{stats?.byStatus.active ?? 0}</div>
              <div className="text-xs text-slate-400">Active</div>
            </div>
          </div>
          {Object.keys(bySource).length > 0 && (
            <div className="mt-3 text-sm text-slate-400">
              Sources:{' '}
              {Object.entries(bySource)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' · ')}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Join the Waitlist</h2>
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <p className="text-sm text-slate-400 mb-3">
              Daftar untuk akses beta awal Agent-X. Form memanggil{' '}
              <code className="text-slate-300">POST /v1/beta/waitlist</code>.
            </p>
            <BetaSignupForm />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Submit Feedback</h2>
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <p className="text-sm text-slate-400 mb-3">
              Kirim bug report / permintaan fitur. Form memanggil{' '}
              <code className="text-slate-300">POST /v1/beta/feedback</code>.
            </p>
            <BetaFeedbackForm />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Recent Feedback ({feedback?.total ?? 0})</h2>
          {feedback && feedback.entries.length > 0 ? (
            <ul className="space-y-2">
              {feedback.entries.map((f) => (
                <li
                  key={f.id}
                  className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm"
                >
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span className="uppercase font-mono">{f.category}</span>
                    <span>
                      {f.rating ? `★ ${f.rating}/5` : ''} · {new Date(f.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>{f.message}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Belum ada feedback.</p>
          )}
        </section>
      </div>
    </main>
  );
}
