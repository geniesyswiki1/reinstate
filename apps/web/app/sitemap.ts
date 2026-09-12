import type { MetadataRoute } from 'next';
import { LANDING_PAGES } from '@reinstate/content';
import { SITE_URL } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics = ['', '/pricing', '/privacy', '/terms'];

  return [
    ...statics.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.5,
    })),
    ...LANDING_PAGES.map((p) => ({
      url: `${SITE_URL}/appeal/${p.platform}/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
