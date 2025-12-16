import { ImageResponse } from 'next/og';

// Image metadata - Apple touch icon
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 140,
          background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🚀
      </div>
    ),
    {
      ...size,
    }
  );
}
