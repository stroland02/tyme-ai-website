import { ImageResponse } from 'next/og';

// Image metadata - larger size for better clarity
export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

// Image generation
export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 56,
          background: 'transparent',
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
