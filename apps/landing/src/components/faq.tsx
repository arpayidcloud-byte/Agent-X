const FAQS = [
  ['Apa bedanya AgentX dengan chat biasa?', 'AgentX mengelola pekerjaan sebagai workflow yang bisa dirouting ke provider, agent, dan tool berbeda. Hasil, biaya, dan statusnya tetap terlihat.'],
  ['Apakah saya harus memakai satu provider?', 'Tidak. Router AgentX dirancang untuk beberapa provider dan endpoint kompatibel OpenAI, sehingga kamu dapat memilih trade-off biaya, latency, dan kualitas.'],
  ['Apakah data saya aman?', 'Workspace, konfigurasi, dan akses anggota dipisahkan per tenant. Detail retensi dan kontrol enterprise dapat dibahas sesuai kebutuhan organisasi.'],
  ['Apakah tersedia CLI?', 'Ya. CLI TUI ditujukan untuk workflow terminal-first, inspeksi task, dan operasi yang lebih cepat untuk pengguna teknis.'],
] as const;

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="text-center">
        <p className="eyebrow">FAQ</p>
        <h2 className="section-title mt-3">Pertanyaan yang biasanya muncul.</h2>
      </div>
      <div className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {FAQS.map(([question, answer]) => (
          <details key={question} className="group py-5">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-left text-sm font-medium text-[#d0d6e0] marker:hidden focus-visible:outline-2 focus-visible:outline-[#7170ff]">
              {question}<span className="text-xl font-light text-[#62666d] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="max-w-2xl pr-10 text-sm leading-6 text-[#8a8f98]">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
