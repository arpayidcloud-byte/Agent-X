const PLANS = [
  {
    name: 'Free',
    price: '$0',
    suffix: '/ forever',
    description: 'Untuk mencoba AgentX dan membangun workflow pertama.',
    features: ['1 workspace', '1.000 task / bulan', 'Provider bawaan', 'Community support'],
    cta: 'Mulai gratis',
    href: 'https://app.id-tech.cloud/signup',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    suffix: '/ user / bulan',
    description: 'Untuk tim yang menjalankan agent dalam pekerjaan harian.',
    features: ['Unlimited workflows', 'Multi-agent teams', 'Provider & model sendiri', 'Usage analytics'],
    cta: 'Coba Pro',
    href: 'https://app.id-tech.cloud/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    suffix: '',
    description: 'Untuk organisasi yang membutuhkan kontrol dan dukungan khusus.',
    features: ['SSO & governance', 'Dedicated limits', 'Audit & retention policy', 'Support SLA'],
    cta: 'Hubungi kami',
    href: 'mailto:hello@id-tech.cloud',
    featured: false,
  },
] as const;

export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow">Harga</p>
        <h2 className="section-title mt-3">Mulai kecil. Scale saat workflow-mu terbukti.</h2>
        <p className="section-copy mt-4">Harga transparan untuk setiap tahap adopsi AI di tim kamu.</p>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <article key={plan.name} className={`linear-card flex flex-col p-6 ${plan.featured ? 'linear-card-featured' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white">{plan.name}</h3>
              {plan.featured && <span className="linear-badge">Paling populer</span>}
            </div>
            <p className="mt-5 text-3xl font-medium tracking-tight text-white">{plan.price}<span className="ml-1 text-xs font-normal text-[#62666d]">{plan.suffix}</span></p>
            <p className="mt-3 min-h-12 text-sm leading-6 text-[#8a8f98]">{plan.description}</p>
            <ul className="mt-6 space-y-3 border-t border-white/[0.06] pt-6 text-sm text-[#d0d6e0]">
              {plan.features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-[#7170ff]">✓</span>{feature}</li>)}
            </ul>
            <a href={plan.href} className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${plan.featured ? 'bg-[#5e6ad2] text-white hover:bg-[#828fff]' : 'border border-white/[0.08] bg-white/[0.02] text-[#d0d6e0] hover:border-[#7170ff]/60 hover:text-white'}`}>{plan.cta}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export { PLANS };
