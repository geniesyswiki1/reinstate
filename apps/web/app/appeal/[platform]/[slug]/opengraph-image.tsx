import { ImageResponse } from 'next/og';
import { LANDING_PAGES } from '@reinstate/content';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return LANDING_PAGES.map((p) => ({ platform: p.platform, slug: p.slug }));
}

/** The classification sentence for that case type, set in serif on --sheet (section 7). */
export default async function OgImage({ params }: { params: Promise<{ platform: string; slug: string }> }) {
  const { platform, slug } = await params;
  const page = LANDING_PAGES.find((p) => p.platform === platform && p.slug === slug);
  const headline = page?.h1 ?? 'Your account was deactivated. Here is exactly what to send back.';
  const price = page?.price ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F7F8FA',
          color: '#161A22',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 52, lineHeight: 1.15, maxWidth: 1000 }}>{headline}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 40 }}>reinstate</div>
            <div style={{ display: 'flex', width: 104, height: 4, background: '#0E7A4F', marginTop: 6, marginLeft: 76 }} />
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: '#5F6672' }}>{price}</div>
        </div>
      </div>
    ),
    size,
  );
}
