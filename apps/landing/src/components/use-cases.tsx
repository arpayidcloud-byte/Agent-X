const USE_CASES = [
  { label: 'Engineering', title: 'Dari issue ke implementation.', body: 'Berikan konteks repo, pecah pekerjaan ke beberapa agent, lalu review hasilnya dalam satu workspace.' },
  { label: 'Operations', title: 'Automasi pekerjaan berulang.', body: 'Rancang workflow untuk triage, reporting, dan handoff tanpa membuat tim berpindah-pindah tools.' },
  { label: 'Product teams', title: 'Eksperimen tanpa lock-in.', body: 'Uji provider dan model berbeda di belakang satu interface, dengan biaya dan latency yang terlihat.' },
] as const;

export default function UseCases() {
  return (
    <section id="use-cases" className="border-y border-white/[0.05] bg-[#0f1011]/50">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Untuk siapa</p>
          <h2 className="section-title mt-3">AI workforce yang masuk akal di dunia kerja nyata.</h2>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
          {USE_CASES.map((item) => (
            <article key={item.label} className="bg-[#08090a] p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#7170ff]">{item.label}</p>
              <h3 className="mt-8 text-xl font-medium tracking-tight text-[#f7f8f8]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#8a8f98]">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
