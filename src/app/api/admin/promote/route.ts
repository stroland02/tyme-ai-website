import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Update the current user to be an admin
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { role: 'admin' },
    });

    return NextResponse.json({ 
      success: true, 
      message: `User ${user.email} is now an admin. Please sign out and sign back in to update your session.` 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
