import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Reinstate: your account was deactivated. Here is exactly what to send back.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
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
        <div style={{ display: 'flex', fontSize: 56, lineHeight: 1.15, maxWidth: 980 }}>
          Your account was deactivated. Here is exactly what to send back.
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 40 }}>reinstate</div>
            <div style={{ display: 'flex', width: 104, height: 4, background: '#0E7A4F', marginTop: 6, marginLeft: 76 }} />
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: '#5F6672' }}>Free classification</div>
        </div>
      </div>
    ),
    size,
  );
}
