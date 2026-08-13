/**
 * Linear-style card for HowItWorks — uses CSS variables defined in globals.css .linear-card
 */
const STEPS = [
  { n: '01', title: 'Hubungkan provider LLM', desc: 'Tambah API key OpenAI, Anthropic, DeepSeek, atau model lokal dalam hitungan detik. Satu endpoint untuk semua.' },
  { n: '02', title: 'Susun agent atau workflow', desc: 'Pakai template siap pakai, atau rakit multi-agent team dari prompt biasa. Tidak perlu belajar framework baru.' },
  { n: '03', title: 'Pantau & optimalkan', desc: 'Biaya, latency, dan cache hit tampil real-time. Auto-fallback aktif saat provider pertama gagal.' },
] as const;

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-[11px] font-semibold tracking-widest text-[#7170ff] uppercase">Cara kerja</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Dari API key ke production dalam 3 langkah
        </h2>
      </div>
      <ol className="mt-14 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.n} className="relative rounded-[10px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-6">
            <span className="text-[12px] font-semibold tracking-widest text-[#7170ff]">{s.n}</span>
            <h3 className="mt-3 text-[15px] font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#8a8f98]">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
