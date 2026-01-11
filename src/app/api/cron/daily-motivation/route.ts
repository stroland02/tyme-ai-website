import { NextResponse } from 'next/server';
import { sendAllDailyMotivations } from '@/lib/notifications';

// This endpoint will be called by Vercel Cron every hour
// It checks which users need motivation at this hour and sends it
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (security)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await sendAllDailyMotivations();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Daily motivation cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}

// POST endpoint for manual testing
export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const result = await sendAllDailyMotivations();
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
