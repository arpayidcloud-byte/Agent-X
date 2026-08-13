import Link from 'next/link';
import {
  ArrowRight,
  Cable,
  Users,
  BarChart3,
  Hexagon,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

// Static marketing page — served on id-tech.cloud (see src/middleware.ts host rewrite).
export const dynamic = 'force-static';
export const revalidate = false;

const APP_URL = 'https://app.id-tech.cloud';

const NAV_LINKS = [
  { href: '#fitur', label: 'Fitur' },
  { href: '#stats', label: 'Statistik' },
];

const FEATURES = [
  {
    icon: Cable,
    title: 'LLM Router',
    desc: 'Satu endpoint untuk semua provider — OpenAI, DeepSeek, Anthropic, dan lainnya. Auto-fallback otomatis jika satu provider down.',
    tone: 'text-accent-300',
  },
  {
    icon: Users,
    title: 'Multi-Agent',
    desc: 'Orkestrasi tim agent yang bekerja paralel: research, coding, dan operasional — semuanya dalam satu workflow.',
    tone: 'text-secondary-300',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'Pantau biaya, latency, dan cache hit di satu dasbor. Setiap request terlacak dan terukur untuk keputusan bisnis.',
    tone: 'text-emerald-300',
  },
];

const STATS = [
  { value: '4/4', label: 'Provider sehat' },
  { value: '24/7', label: 'Agent berjalan otomatis' },
  { value: '1×', label: 'Endpoint untuk semua LLM' },
  { value: '0', label: 'Vendor lock-in' },
];

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-secondary-600 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]">
        <Hexagon className="h-4 w-4" strokeWidth={2} fill="currentColor" aria-hidden />
      </span>
      <span className="text-sm font-semibold tracking-tight text-white">
        id-tech<span className="text-accent-300">.cloud</span>
      </span>
    </span>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/[0.04] bg-surface-0/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Brand />
        <div className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-200"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`${APP_URL}/login`}
            className="rounded-xl border border-white/[0.06] px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.03] hover:text-white"
          >
            Masuk
          </Link>
          <Link
            href={`${APP_URL}/signup`}
            data-testid="cta-landing-signup"
            className="btn-gradient rounded-xl px-4 py-2 text-xs font-semibold text-white"
          >
            Daftar Gratis
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent-500/[0.12] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-32 h-72 w-72 rounded-full bg-secondary-500/[0.08] blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-surface-1/60 px-3 py-1.5 text-[11px] font-medium text-slate-300">
            <span className="status-dot" />
            Platform AI Agent untuk Tim Modern
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            AgentX — <span className="text-gradient">AI Agent Workspace</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
            Satu platform untuk LLM router, multi-agent teams, dan analytics. Kelola seluruh AI
            workforce dari satu dasbor — dibangun di atas{' '}
            <span className="font-medium text-slate-200">id-tech.cloud</span>.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`${APP_URL}/signup`}
              data-testid="cta-mulai-gratis"
              className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            >
              Mulai Gratis
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={`${APP_URL}/login`}
              data-testid="cta-masuk-app"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-surface-1/60 px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-white/[0.12] hover:text-white"
            >
              Masuk ke App
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/80" aria-hidden />
              Gratis untuk mulai
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-300/80" aria-hidden />
              Data aman &amp; terisolasi
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-secondary-300/80" aria-hidden />
              Tanpa setup infrastruktur
            </span>
          </div>
        </div>

        {/* Mock workspace glass visual */}
        <div className="glass-card mx-auto mt-16 max-w-3xl rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
            </div>
            <span className="text-[11px] font-medium text-slate-500">app.id-tech.cloud</span>
          </div>
          <div className="space-y-3 pt-4">
            <div className="rounded-xl border border-white/[0.04] bg-surface-2/60 p-4">
              <p className="text-xs font-medium text-slate-200">
                &quot;Buat REST API untuk manajemen inventaris&quot;
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="rounded-md bg-accent-500/15 px-2 py-1 font-medium text-accent-300">
                  openai_compatible
                </span>
                <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-medium text-emerald-300">
                  success · 2.4s
                </span>
                <span className="rounded-md bg-white/[0.04] px-2 py-1 text-slate-400">$0.0012</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.04] bg-surface-2/60 p-4 opacity-70">
              <p className="text-xs font-medium text-slate-200">
                &quot;Analisis tren pasar crypto Q3 2026&quot;
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="rounded-md bg-secondary-500/15 px-2 py-1 font-medium text-secondary-300">
                  multi-agent · 3 workers
                </span>
                <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-medium text-emerald-300">
                  running
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-[11px] font-semibold tracking-widest text-accent-300 uppercase">
          Fitur
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Semua yang kamu butuhkan, satu platform
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Dari routing LLM hingga orkestrasi agent — tanpa ribet mengelola banyak tools.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="glass-card card-hover rounded-2xl p-6">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 ${f.tone}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section id="stats" className="mx-auto max-w-6xl px-6 pb-16 sm:pb-20">
      <div className="glass-card grid grid-cols-2 gap-6 rounded-3xl px-6 py-8 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{s.value}</p>
            <p className="mt-1 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="glass-card relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-accent-500/[0.14] blur-[90px]"
        />
        <div className="relative">
          <Sparkles className="mx-auto h-6 w-6 text-accent-300" strokeWidth={1.5} aria-hidden />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Siap membangun AI workforce-mu?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
            Daftar gratis dan mulai kelola LLM router, multi-agent teams, dan analytics dalam
            hitungan menit — tanpa kartu kredit.
          </p>
          <Link
            href={`${APP_URL}/signup`}
            data-testid="cta-cta-signup"
            className="btn-gradient mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-white"
          >
            Daftar Gratis Sekarang
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.04]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <Brand />
        <div className="flex items-center gap-5 text-[11px] text-slate-500">
          <a href="https://app.id-tech.cloud" className="transition-colors hover:text-slate-300">
            app.id-tech.cloud
          </a>
          <a href="https://panel.id-tech.cloud" className="transition-colors hover:text-slate-300">
            panel.id-tech.cloud
          </a>
          <a href="https://api.id-tech.cloud" className="transition-colors hover:text-slate-300">
            api.id-tech.cloud
          </a>
        </div>
        <p className="text-[11px] text-slate-600">id-tech.cloud © 2026</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface-0 text-slate-100">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Cta />
      <Footer />
    </main>
  );
}
