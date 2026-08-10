'use client';

import Link from 'next/link';

const tiers = [
  {
    name: 'Free',
    price: 'Gratis',
    features: ['5 providers mock', '1 workflow', 'Community'],
    cta: 'Daftar Gratis',
  },
  {
    name: 'Pro',
    price: 'Rp 99k',
    period: '/bulan',
    features: ['Unlimited providers', '10 workflows', 'Analytics', 'Multi-agent'],
    cta: 'Pilih Pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Dedicated support', 'On-premise', 'SLA'],
    cta: 'Hubungi Kami',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Harga</h1>
      <p className="text-center text-white/60 mb-12">Pilih paket sesuai kebutuhan tim</p>
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl border p-6 backdrop-blur ${t.featured ? 'border-violet-500/50 bg-violet-500/10' : 'border-white/10 bg-white/5'}`}
          >
            <h3 className="text-xl font-semibold">{t.name}</h3>
            <p className="mt-2 text-3xl font-bold">
              {t.price}
              <span className="text-sm font-normal text-white/60">{t.period ?? ''}</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/70">
              {t.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={`mt-8 block text-center rounded-xl py-3 text-sm font-semibold ${t.featured ? 'bg-violet-600 hover:bg-violet-500' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
