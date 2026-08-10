import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://id-tech.cloud';
  const appBase = 'https://app.id-tech.cloud';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: appBase, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    {
      url: `${appBase}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
