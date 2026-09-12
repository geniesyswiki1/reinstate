import type { MetadataRoute } from 'next';
import { SITE_URL, isNoindex } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  // A preview or test deploy must never compete with the production domain for the
  // terms the landing pages target, so it asks to be left out of the index entirely.
  if (isNoindex()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/case/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
